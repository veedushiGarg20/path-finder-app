#include"bellman_ford.h"
#include<stdexcept>
#include<limits>

using namespace std;

DijkstraResult bellman_ford(const Graph& graph, const string& source, const string& target) {
    // checking valid inputs
    if (graph.find(source) == graph.end())
        throw invalid_argument("Source node "+ source +" not found.");
    if (graph.find(target) == graph.end())
        throw invalid_argument("Target node "+ target +" not found.");


    const double INF = numeric_limits<double>::infinity();

    vector<string> nodes;
    for (auto& [node, _] : graph)
        nodes.push_back(node);
    
    int n = nodes.size();

    // distance table and prev table
    unordered_map<string, double> dist;
    unordered_map<string, string> prev;

    // initialising all distances
    for (const string& node : nodes)
        dist[node] = INF;
    dist[source] = 0.0;

    // bellman-ford loop
    for (int i = 0; i < n-1; i++) {
        bool updated = false;

        for (auto& [u, edges] : graph) {
            if (dist[u] == INF) continue;

            for (const Edge& e : edges) {
                double alt = dist[u] + e.weight;
                if (alt < dist[e.to]) {
                    dist[e.to] = alt;
                    prev[e.to] = u;
                    updated = true;
                }
            }
        }

        // early break if no updates
        if (!updated) break;
    }

    // negative cycle detection
    // relax one more time
    for (auto& [u, edges] : graph) {
        if (dist[u] == INF) continue;

        for (const Edge& e : edges) {
            double alt = dist[u] + e.weight;
            if (alt < dist[e.to]) 
                throw runtime_error("Graph contains a negative cycle -- no shortest path exists.");
        }
    }

    // reconstructing the path
    DijkstraResult result;

    if (dist[target] == INF) {
        result.cost = -1.0;
        return result;
    }

    result.cost = dist[target];
    string cur = target;

    while (cur != source) {
        result.path.push_back(cur);
        cur = prev[cur];
    }
    result.path.push_back(source);
    reverse(result.path.begin(), result.path.end());
    
    return result;
}