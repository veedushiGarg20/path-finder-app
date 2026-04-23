import { useState } from "react"
import GraphCanvas from "./components/GraphCanvas"
import Controls from "./components/Controls"
import PathResult from "./components/PathResult"
import { buildGraph } from "./utils"
import { findShortestPath } from "./api"
import styles from "./App.module.css"

export default function App() {
    const [nodes, setNodes] = useState([])
    const [edges, setEdges] = useState([])
    const [source, setSource] = useState("")
    const [target, setTarget] = useState("")
    const [result, setResult] = useState(null)
    const [error, setError] = useState("")
    const [nodeCounter, setNodeCounter] = useState(0)

    async function handleFindPath() {
        // build graph from nodes and edges
        const graph = buildGraph(nodes, edges)

        // calling the function
        try {
            setError("")
            setResult(null)
            const data = await findShortestPath(graph, source, target)
            setResult(data)
        } catch (err) {
            setError(err.message)
        }
    }

    function handleClear() {
        setNodes([])
        setEdges([])
        setSource("")
        setTarget("")
        setResult(null)
        setError("")
        setNodeCounter(0)
    }

    return (
        <div className={styles.app}>
            <h1 className={styles.heading}>Dijkstra Path Finder</h1>
            <div className={styles.card}>
                <GraphCanvas
                nodes={nodes}
                edges={edges}
                setNodes={setNodes}
                setEdges={setEdges}
                result={result}
                nodeCounter={nodeCounter}
                setNodeCounter={setNodeCounter}
                />
                <Controls
                    nodes={nodes}
                    source={source}
                    target={target}
                    setSource={setSource}
                    setTarget={setTarget}
                    onFindPath={handleFindPath}
                    onClear={handleClear}
                />
                <PathResult
                    result={result}
                    error={error}
                />
            </div>
            
        </div>
    )
}