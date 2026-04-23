#pragma once

#include<vector>
#include<string>
#include<unordered_map>
using namespace std;

struct Edge {
    string to;
    double weight;
};

struct DijkstraResult {
    vector<string> path;
    double cost; //cost = -1.0 if no path
};

using Graph = unordered_map<string, vector<Edge>>;

DijkstraResult dijkstra(const Graph& graph, const string& source, const string& target);
