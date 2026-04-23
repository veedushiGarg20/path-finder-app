const API_URL = "http://localhost:8000"

export async function findShortestPath(graph, source, target) {
    const response = await fetch(`${API_URL}/shortest-path`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({graph, source, target})
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail)
    }

    return await response.json()
}