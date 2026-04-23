export function buildGraph(nodes, edges) {
    const graph = {}

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const edgeList = []
        for (let j = 0; j < edges.length; j++) {
            const edge = edges[j]

            if (edge.from === node.id) {
                const edgeDict = {to: edge.to, weight: edge.weight}
                edgeList.push(edgeDict)
            }
        }
        graph[node.id] = edgeList
    }

    return graph
}