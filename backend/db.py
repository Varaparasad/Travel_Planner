import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_DETAILS")
if not MONGO_DETAILS:
    raise ValueError("MONGO_DETAILS environment variable not set!")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

db = client.travel_planner

user_collection = db.get_collection("users")
plan_collection = db.get_collection("plans")

print("--- Connected to MongoDB... ---")