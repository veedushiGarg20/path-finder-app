import asyncio
import motor.motor_asyncio
from dotenv import load_dotenv
import os

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")
COLLECTION_NAME = "templates"

if not MONGO_URL or not DB_NAME:
    raise ValueError("Missing required environment variables. Check your .env file.")

templates = [
    {
        "name": "Simple Triangle",
        "description": "3 nodes, good for testing basic path-finding algorithms",
        "nodes": [
            {"id": "A", "x": 300, "y": 100},
            {"id": "B", "x": 150, "y": 350},
            {"id": "C", "x": 450, "y": 350},
        ],
        "edges": [
            {"from": "A", "to": "B", "weight": 4},
            {"from": "A", "to": "C", "weight": 2},
            {"from": "B", "to": "C", "weight": 1}
        ]
    },
    {
        "name": "Linear Chain",
        "description": "4 nodes in a straight line, tests sequential path finding",
        "nodes": [
            {"id": "A", "x": 100, "y": 200},
            {"id": "B", "x": 250, "y": 200},
            {"id": "C", "x": 400, "y": 200},
            {"id": "D", "x": 550, "y": 200}
        ],
        "edges": [
            {"from": "A", "to": "B", "weight": 3},
            {"from": "B", "to": "C", "weight": 5},
            {"from": "C", "to": "D", "weight": 2}
        ]
    },
    {
        "name": "Diamond",
        "description": "4 nodes in a diamond shape, two paths from source to target",
        "nodes": [
            {"id": "A", "x": 300, "y": 80},
            {"id": "B", "x": 150, "y": 250},
            {"id": "C", "x": 450, "y": 250},
            {"id": "D", "x": 300, "y": 420}
        ],
        "edges": [
            {"from": "A", "to": "B", "weight": 1},
            {"from": "A", "to": "C", "weight": 4},
            {"from": "B", "to": "D", "weight": 6},
            {"from": "C", "to": "D", "weight": 2}
        ]
    },
    {
        "name": "Negative Weights",
        "description": "5 nodes with one negative weight, triggers Bellman-Ford",
        "nodes": [
            {"id": "A", "x": 100, "y": 200},
            {"id": "B", "x": 250, "y": 100},
            {"id": "C", "x": 250, "y": 300},
            {"id": "D", "x": 400, "y": 200},
            {"id": "E", "x": 550, "y": 200}
        ],
        "edges": [
            {"from": "A", "to": "B", "weight": 2},
            {"from": "A", "to": "C", "weight": 4},
            {"from": "B", "to": "D", "weight": -1},
            {"from": "C", "to": "D", "weight": 3},
            {"from": "D", "to": "E", "weight": 2}
        ]
    }
]

async def seed():
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]
    
    # clear existing templates
    await collection.delete_many({})
    print("Cleared existing templates.")
    
    result = await collection.insert_many(templates)
    print(f"Inserted {len(result.inserted_ids)} templates into '{COLLECTION_NAME}' collection.")
    
    client.close()
    
if __name__ == "__main__":
    asyncio.run(seed())