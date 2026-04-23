cmake_minimum_required(VERSION 3.15)
project(dijkstra_core CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Build the algorithm as a static library so both the pybind11
# module and any standalone test binary can link against it.
add_library(dijkstra_core STATIC
    dijkstra.cpp
    bellman_ford.cpp
)

target_include_directories(dijkstra_core PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})