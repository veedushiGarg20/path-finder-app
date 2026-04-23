from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import dijkstra_module #type: ignore

app = FastAPI()

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
    
# creating the POST endpoint
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
