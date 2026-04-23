#include<iostream>
#include"dijkstra.h"

using namespace std;

int main() {

    // creating graph
    Graph g;
    g["A"] = { {"B", 1.0}, {"C", 4.0}};
    g["B"] = { {"D", 2.0}};
    g["C"] = { {"D", 1.0}};
    g["D"] = {};

    DijkstraResult r = dijkstra(g, "A", "D");

    cout << "Cost: " << r.cost << endl;
    cout << "Path: ";
    for (const string& node : r.path)
        cout << node << " ";
    cout << endl;

    // testing unreachable node
    g["E"] = {};
    DijkstraResult r2 = dijkstra(g, "A", "E");
    cout << "Unreachable cost: " << r2.cost << endl;
    
    return 0;
}