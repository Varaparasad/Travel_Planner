import os
import uvicorn
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from typing import TypedDict
from langgraph.graph import StateGraph, END
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_groq import ChatGroq

import auth  
import plan_cache  
from auth import UserInDB, get_current_user 

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY") 
GROQ_MODEL = "llama-3.1-8b-instant" 

app = FastAPI(
    title="AI Travel Planner API",
    description="Backend for the LangGraph AI Travel Planner",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

class TravelPlanRequest(BaseModel):
    destination: str
    from_location: str
    start_date: str
    end_date: str
    people: int
    trip_type: str
    min_budget: float
    max_budget: float
    group_details: str


class TravelPlanState(TypedDict):
    destination: str
    from_location: str
    start_date: str
    end_date: str
    people: int
    trip_type: str
    min_budget: float
    max_budget: float
    group_details: str
    days: int
    location_data: dict
    flight_data: dict
    itinerary_markdown: str

def calculate_days(start_date_str, end_date_str):
    try:
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
        return (end_date - start_date).days + 1
    except ValueError:
        return 0

def fetch_location_data(destination):
    if "goa" in destination.lower():
        return {
            "latitude": 15.2993, "longitude": 74.1240, "local_currency": "INR",
            "nearby_cities": ["Mumbai", "Bangalore"],
            "accommodation_types": { "budget": "Hostel", "mid-range": "3-star", "luxury": "5-star" }
        }
    return {
        "latitude": 51.5074, "longitude": 0.1278, "local_currency": "USD",
        "nearby_cities": ["Nearby City A", "Nearby City B"],
        "accommodation_types": { "budget": "Hostel", "mid-range": "3-star", "luxury": "Boutique" }
    }


def fetch_flights(from_location, destination):
    if "hyderabad" in from_location.lower() and "goa" in destination.lower():
        return {
            "outbound_flight": {"airline": "IndiGo (Simulated)", "scheduled_time": "10:30 AM IST"},
            "return_flight": {"airline": "Vistara (Simulated)", "scheduled_time": "4:00 PM IST"}
        }
    return {
        "outbound_flight": {"airline": "Major Carrier (Simulated)", "scheduled_time": "11:00 AM Local"},
        "return_flight": {"airline": "Major Carrier (Simulated)", "scheduled_time": "3:00 PM Local"}
    }

def fetch_data_node(state: TravelPlanState) -> dict:
    print(f"--- Node 1: Fetching external data for {state['destination']} ---")
    state['days'] = calculate_days(state['start_date'], state['end_date'])
    location_data = fetch_location_data(state['destination'])
    flight_data = fetch_flights(state['from_location'], state['destination'])
    return {"location_data": location_data, "flight_data": flight_data, "days": state['days']}

def generate_plan_node(state: TravelPlanState) -> dict:
    print(f"--- Node 2: Generating plan using {GROQ_MODEL} ---")
    if not GROQ_API_KEY:
        return {"itinerary_markdown": "ERROR: Groq API Key is missing."}
    
    days = state['days']
    location_data = state['location_data']
    flight_data = state['flight_data']
    
    system_prompt = f"""
    You are an expert, meticulous, data-driven travel agent.
    Your task is to create a comprehensive, day-by-day travel itinerary based on the user's specific constraints and the provided real-time data.
    [...Same exact prompt as before...]
    ---
    Generate the full itinerary now. Start immediately with the output.
    """
    user_query = (f"Create a detailed {days}-day trip plan for {state['destination']}...")

    llm = ChatGroq(temperature=0.7, groq_api_key=GROQ_API_KEY, model_name=GROQ_MODEL)
    messages = [SystemMessage(content=system_prompt), HumanMessage(content=user_query)]

    try:
        response = llm.invoke(messages)
        return {"itinerary_markdown": response.content}
    except Exception as e:
        return {"itinerary_markdown": f"ERROR: LLM/Groq API call failed: {e}"}

workflow = StateGraph(TravelPlanState)
workflow.add_node("fetch_data", fetch_data_node)
workflow.add_node("generate_plan", generate_plan_node)
workflow.set_entry_point("fetch_data")
workflow.add_edge("fetch_data", "generate_plan")
workflow.add_edge("generate_plan", END)
app_graph = workflow.compile()


def adapt_plan_from_cache(request: TravelPlanRequest, cached_plan: str) -> str:
    """
    Uses an LLM to adapt a cached plan to the new user request.
    This is synchronous and will be run by the async endpoint.
    """
    print("--- Adapting plan from cache ---")
    
    adapt_prompt = f"""
    You are a travel plan editor. A user has new requirements, but we found an existing travel plan that is very similar.
    Your task is to adapt the 'EXISTING PLAN' to perfectly match the 'NEW REQUIREMENTS'.
    
    Pay close attention to changes in:
    - Dates (e.g., {request.start_date} to {request.end_date})
    - Budget (e.g., ${request.min_budget} - ${request.max_budget})
    - Number of people (e.g., {request.people})
    - Specific interests (e.g., {request.group_details})

    Ensure the output format is identical to the existing plan (full markdown).

    ---
    NEW REQUIREMENTS:
    {request.model_dump_json(indent=2)}
    ---
    EXISTING PLAN (to adapt):
    
    {cached_plan}
    
    ---

    Generate the new, fully adapted plan now.
    """
    
    try:
        llm = ChatGroq(temperature=0.5, groq_api_key=GROQ_API_KEY, model_name=GROQ_MODEL)
        response = llm.invoke([SystemMessage(content=adapt_prompt)])
        return response.content
    except Exception as e:
        print(f"--- Error adapting plan: {e} ---")
        return cached_plan # Fallback

@app.post("/generate-plan")
async def generate_plan_api(
    request: TravelPlanRequest, 
    current_user: UserInDB = Depends(get_current_user) 
):
    """
    Endpoint to generate a plan.
    Now protected by auth and uses a MongoDB similarity cache.
    """
    print(f"--- Plan request received from user: {current_user.username} ---")
    
    try:
        cached_plan = await plan_cache.find_similar_plan(request) 
        
        if cached_plan:
            print("--- Found similar plan, adapting... ---")
            adapted_plan = adapt_plan_from_cache(request, cached_plan)
            return {"itinerary": adapted_plan, "source": "cache-adapted"}
        
        print("--- No similar plan in cache. Generating new plan... ---")
        initial_state = request.model_dump()
        initial_state.update({
            'days': 0,
            'location_data': {},
            'flight_data': {},
            'itinerary_markdown': ""
        })
        
        final_state = app_graph.invoke(initial_state)
        itinerary_markdown = final_state.get('itinerary_markdown', '')

        if itinerary_markdown.startswith("ERROR:"):
            raise HTTPException(status_code=500, detail=itinerary_markdown)
        
        await plan_cache.add_plan_to_cache(request, itinerary_markdown) 
        return {"itinerary": itinerary_markdown, "source": "newly-generated"}
    except Exception as e:
        print(f"Critical Internal ServerError: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

@app.get("/")
def read_root():
    return {"message": "AI Travel Planner API is running. POST to /register or /token. POST to /generate-plan to create a new itinerary (Auth Required)."}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5000)