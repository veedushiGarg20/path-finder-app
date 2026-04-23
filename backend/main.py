from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import dijkstra_module #type: ignore
import motor.motor_asyncio
from dotenv import load_dotenv
from contextlib import asynccontextmanager
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")

if not MONGO_URL or not DB_NAME:
    raise ValueError("Missing required environment variables. Check your .env file.")

# mongodb client setup
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

@asynccontextmanager
async def lifespan(app : FastAPI):
    # startup confirm MongoDB connection
    await db.command("ping")
    print("Connected to MongoDB.")
    yield
    # close client
    client.close()
    print("MongoDB connection closed")

app = FastAPI(lifespan=lifespan)

# configuring middleware to allow request from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite's default port, (React App - localhost:5173, FastAPI server - localhost:8000)
    allow_methods=["*"],
    allow_headers=["*"]
)

# defining request/response models
class EdgeInput(BaseModel):
    to: str
    weight: float

class ShortestPathRequest(BaseModel):
    graph: dict[str, list[EdgeInput]]
    source: str
    target: str
    
class ShortestPathResponse(BaseModel):
    path: list[str]
    cost: float
    algorithm: str
    
def has_negative_weights(graph: dict) -> bool:
    for edges in graph.values():
        for edge in edges:
            if edge["weight"] < 0:
                return True
    return False

# creating GET /templates endpoint
@app.get("/templates")
async def get_templates():
    try:
        templates = []
        async for template in db["templates"].find({}, {"_id": 0}):
            templates.append(template)
        return templates
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
# creating the POST /shortest-path endpoint
@app.post("/shortest-path", response_model=ShortestPathResponse)
def shortest_path(req: ShortestPathRequest):
    # converting pydantic models into python dicts for the c++ module
    graph_dict = {}
    
    for node, edges in req.graph.items():
        edge_list = []
        for e in edges:
            edge_dict = {"to": e.to, "weight": e.weight}
            edge_list.append(edge_dict)
        graph_dict[node] = edge_list
        
    try:
        if (has_negative_weights(graph_dict)):
            result = dijkstra_module.find_path_bellman_ford(graph_dict, req.source, req.target)
            algorithm = "Bellman-Ford"
        else:
            result = dijkstra_module.find_path(graph_dict, req.source, req.target)
            algorithm = "Dijkstra"
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    if (result.cost == -1.0):
        raise HTTPException(status_code=404, detail="No path found between given nodes.")
    
    return ShortestPathResponse(path=result.path, cost=result.cost, algorithm=algorithm)
