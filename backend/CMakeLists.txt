cmake_minimum_required(VERSION 3.15)
project(dijkstra_app CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# ── 1. Core library ────────────────────────────────────────────────────────
add_subdirectory(cpp)

# ── 2. pybind11 ───────────────────────────────────────────────────────────
# Requires pybind11 to be installed.  Two common ways:
#   pip install pybind11          → use find_package below
#   git submodule add pybind11/   → use add_subdirectory(pybind11)
find_package(pybind11 REQUIRED)

# ── 3. Python extension module ────────────────────────────────────────────
pybind11_add_module(dijkstra_module
    bindings/bindings.cpp
)

# Link our static core into the shared extension
target_link_libraries(dijkstra_module PRIVATE dijkstra_core)

# The compiled .so lands in the backend/ directory so Python can import it
# as  `import dijkstra_module`  from the same folder as main.py.
set_target_properties(dijkstra_module PROPERTIES
    LIBRARY_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}
)

# ── Build instructions (run from backend/) ────────────────────────────────
# mkdir build && cd build
# cmake ..
# cmake --build . --config Release
# The resulting  dijkstra_module*.so  appears in  backend/