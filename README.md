# Dijkstra Path Finder

A full-stack shortest path visualizer built to demonstrate DSA competency along with systems design across three languages - C++, Python and Javascript.

## Architecture

The shortest path algorithm is implemented in C++ and compiled into a shared library using pybind11. FastAPI exposes it as a REST endpoint. React renders an interactive graph interface where users can render weighted graphs and visualize the shortest path.

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Algorithm | C++17 | Performance, demonstrates low-level DSA |
| Language bridge | pybind11 | Exposes C++ to Python without overhead |
| Build system | CMake | Industry standard for C++ projects |
| Backend | FastAPI | Lightweight, async, automatic validation |
| Frontend | React + Vite | Component-based, fast dev experience |
| Styling | CSS Modules | Scoped styles, no framework overhead |

## Features
- Interactive graph canvas: click to place nodes, click two nodes to draw a directed weighted edge
- Shortest path highlighted in orange on the canvas
- Path and total cost displayed below the canvas
- Clear canvas to start over

## Steps to Run locally:

### Prerequisites
- Python 3.11+
- Node.js 18+
- CMake
- pybind11 (`pip install pybind11`)

### backend

```bash
cd backend
mkdir build && cd build
cmake .. -DCMAKE_PREFIX_PATH=$(python3 -c "import pybind11; print(pybind11.get_cmake_dir())")
cmake --build . --config Release
cd ..
pip install -r requirements.txt
uvicorn main:app --reload
```

### frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in Chrome.

## Project Structure

path-finder-app/
├── backend/
│   ├── cpp/
│   │   ├── dijkstra.h                  # Graph and result type definitions
│   │   ├── dijkstra.cpp                # Dijkstra's algorithm implementation
│   │   └── CMakeLists.txt              # Core library build config
│   ├── bindings/
│   │   └── bindings.cpp                # pybind11 C++ → Python bridge
│   ├── CMakeLists.txt                  # Top level build config
│   ├── main.py                         # FastAPI endpoint
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── GraphCanvas.jsx         # Interactive SVG graph editor
    │   │   ├── GraphCanvas.module.css  # Canvas styles
    │   │   ├── Controls.jsx            # Source, target, buttons
    │   │   ├── Controls.module.css     # Controls styles
    │   │   ├── PathResult.jsx          # Result display
    │   │   └── PathResult.module.css   # Result styles
    │   ├── App.jsx                     # Root component, state management
    │   ├── App.module.css              # App layout styles
    │   ├── api.js                      # FastAPI client
    │   ├── utils.js                    # Graph builder utility
    │   └── main.jsx                    # React entry point
    ├── index.html                      # HTML entry point
    ├── package.json                    # Dependencies and scripts
    └── vite.config.js                  # Vite configuration

## Future Improvements

- Bellman-Ford fallback for negative weight edges
- Step by step algorithm visualizer
- Integration with a graph dataset API to lead real world graphs