#include"dijkstra.h"

#include<queue>
#include<unordered_map>
#include<limits>
#include<algorithm>
#include<stdexcept>

using namespace std;

DijkstraResult dijkstra(const Graph& graph, const string& source, const string& target) {
    // checking valid inputs
    if (graph.find(source) == graph.end()) 
        throw invalid_argument("Source node "+ source +" not in graph.");
    if (graph.find(target) == graph.end()) 
        throw invalid_argument("Target node "+ target +" not in graph.");

    // distance table
    const double INF = numeric_limits<double>::infinity();
    unordered_map<string, double> dist;
    unordered_map<string, string> prev;

    // initialising all distances
    for (auto& [node, _] : graph) {
        dist[node] = INF;
    }
    dist[source] = 0.0;

    //min heap - (cost, node)
    using PQEntry = pair<double, string>;
    priority_queue<PQEntry, vector<PQEntry>, greater<PQEntry>>pq;
    pq.push({0.0, source});

    // dijkstra loop
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (d > dist[u]) continue;

        // exit if target reached
        if (u == target) break;

        auto it = graph.find(u);
        if (it == graph.end()) continue;

        for (const Edge& e : it->second) {
            if (e.weight < 0.0) 
                throw invalid_argument("Negative edge wait encountered.");
            
            
            double alt = dist[u] + e.weight;
            if (alt < dist[e.to]) {
                dist[e.to] = alt;
                prev[e.to] = u;
                pq.push({alt, e.to});
            }
        }
    }

    // re-constructing the path
    DijkstraResult result;

    if (dist[target] == INF) {
        // target node is unreachable
        result.cost = -1.0;
        return result;
    }

    result.cost = dist[target];

    // walk backwards from target to reconstruct path
    string cur = target;
    while (cur != source) {
        result.path.push_back(cur);
        cur = prev[cur];
    }
    result.path.push_back(source);
    reverse(result.path.begin(), result.path.end());

    return result;
}