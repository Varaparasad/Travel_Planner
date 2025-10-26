from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional


from db import plan_collection


if TYPE_CHECKING:
    from main import TravelPlanRequest

async def add_plan_to_cache(request: 'TravelPlanRequest', itinerary_markdown: str):
    """Adds a newly generated plan to the MongoDB cache."""
    
    doc = {
        "request_data": request.model_dump(),
        "itinerary": itinerary_markdown,
        "created_at": datetime.now(timezone.utc)
    }
    
    try:
       
        await plan_collection.insert_one(doc)
        print(f"--- Added new plan to cache for destination: {request.destination} ---")
    except Exception as e:
        print(f"--- Error adding plan to cache: {e} ---")

async def find_similar_plan(request: 'TravelPlanRequest') -> Optional[str]:
    """
    Queries MongoDB for a plan with the same destination and trip_type.
    This is our heuristic for "similarity".
    Returns the itinerary markdown if found, else None.
    """
    
    
    query = {
        "request_data.destination": request.destination,
        "request_data.trip_type": request.trip_type
    }
    
    try:
       
        doc = await plan_collection.find_one(query, sort=[("created_at", -1)])
        
        if doc:
            print(f"--- Cache: Found similar plan (same destination/type). ID: {doc['_id']} ---")
            return doc.get("itinerary")
        
        print("--- Cache: No similar plan found (destination/type). ---")
        return None
        
    except Exception as e:
        print(f"--- Error querying cache: {e} ---")
        return None