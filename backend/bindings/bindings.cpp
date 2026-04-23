#include <pybind11/pybind11.h>
#include <pybind11/stl.h>          // automatic std::vector / std::unordered_map conversion

#include "dijkstra.h"

namespace py = pybind11;

// ---------------------------------------------------------------------------
// Helper: convert Python dict  { "A": [{"to":"B","weight":3.0}, ...], ... }
//         into the C++ Graph type.
// ---------------------------------------------------------------------------
static Graph dict_to_graph(const py::dict& raw)
{
    Graph g;
    for (auto& [key, val] : raw) {
        std::string from = key.cast<std::string>();
        g[from]; // ensure the node exists even if it has no outgoing edges

        for (auto& edge_obj : val.cast<py::list>()) {
            py::dict ed = edge_obj.cast<py::dict>();
            Edge e;
            e.to     = ed["to"].cast<std::string>();
            e.weight = ed["weight"].cast<double>();
            g[from].push_back(e);
        }
    }
    return g;
}

// ---------------------------------------------------------------------------
// Module definition
// ---------------------------------------------------------------------------
PYBIND11_MODULE(dijkstra_module, m)
{
    m.doc() = "C++ Dijkstra shortest-path solver exposed to Python via pybind11";

    // Expose the result struct so Python can inspect .path and .cost directly.
    py::class_<DijkstraResult>(m, "DijkstraResult")
        .def_readonly("path", &DijkstraResult::path)
        .def_readonly("cost", &DijkstraResult::cost)
        .def("__repr__", [](const DijkstraResult& r) {
            if (r.cost < 0)
                return std::string("DijkstraResult(no path)");
            std::string s = "DijkstraResult(cost=" + std::to_string(r.cost) + ", path=[";
            for (size_t i = 0; i < r.path.size(); ++i)
                s += (i ? ", " : "") + r.path[i];
            return s + "])";
        });

    // Main entry point called from FastAPI:
    //   dijkstra_module.find_path(graph_dict, source, target) -> DijkstraResult
    m.def("find_path",
        [](const py::dict& raw_graph,
           const std::string& source,
           const std::string& target) -> DijkstraResult
        {
            Graph g = dict_to_graph(raw_graph);
            return dijkstra(g, source, target);
        },
        py::arg("graph"),
        py::arg("source"),
        py::arg("target"),
        R"doc(
Find the shortest path from `source` to `target` in `graph`.

Parameters
----------
graph : dict
    Adjacency list as  { node_id: [{"to": node_id, "weight": float}, ...] }
source : str
    Starting node id.
target : str
    Destination node id.

Returns
-------
DijkstraResult
    .path  -- list[str], ordered node ids from source to target
    .cost  -- float, total path cost; -1.0 if no path exists
        )doc"
    );
}