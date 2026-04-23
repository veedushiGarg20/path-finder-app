import { useState } from 'react'

const CANVAS_WIDTH = 889
const CANVAS_HEIGHT = 550
const NODE_RADIUS = 20
const SELECT_THRESHOLD = 15
const TOO_CLOSE_THRESHOLD = 50

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

// to check if a node is present within the threshold, true - return node, false - return null
function getNodeAtPosition(nodes, x, y, threshold) {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const distance = getDistance(x, y, node.x, node.y)
        if (distance <= threshold)
            return node
    }
    return null
}

// to check if a node is part of result, true - return true, false - return false
function isNodePartOfPath(result, nodeID) {
    if (!result) return false
    return result.path.includes(nodeID)
}

// to check if an edge is part of result, true - return true, false - return false
function isEdgePartOfPath(result, from, to) {
    if (!result) return false
    const path = result.path
    for (let i = 0; i < path.length - 1; i++) {
        if (path[i] === from && path[i+1] === to)
            return true
        if (path[i] === to && path[i+1] === from)
            return true
    }
    return false
}

export default function GraphCanvas({nodes, edges, setNodes, setEdges, result, nodeCounter, setNodeCounter}) {
    // initialising the required internal states
    const [selectedNode, setSelectedNode] = useState(null)

    function handleCanvasClick(event) {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        // to check if clicked on existing node
        const clickedNode = getNodeAtPosition(nodes, x, y, SELECT_THRESHOLD)

        if (clickedNode) {
            handleNodeClick(clickedNode)
            return
        }

        // to check if clicked too close to an existing node
        const tooClose = getNodeAtPosition(nodes, x, y, TOO_CLOSE_THRESHOLD)

        if (tooClose) {
            alert("Too close to an existing node. Please click further away.")
            return
        }

        // if code reaches here, confirmed no existing node is selected

        // place new node
        const label = String.fromCharCode(65 + nodeCounter)
        const newNode = {id: label, x, y}
        setNodes([...nodes, newNode])
        setNodeCounter(nodeCounter + 1)
    }

    function handleNodeClick(clickedNode) {
        // if no selected node, first click - select this node
        if (!selectedNode) {
            setSelectedNode(clickedNode)
        }
        // if selected node present, second click - draw an edge between selectedNode and clickedNode
        else {
            // if clicked on same node, deselect node
            if (selectedNode.id === clickedNode.id) {
                setSelectedNode(null)
                return
            }

            // to check if edge already exists
            let edgeExists = false
            for (let i = 0; i < edges.length; i++) {
                const e = edges[i]
                // checking only for one direction;     a -> b   &   b -> a   edges are different
                if (e.from === selectedNode.id && e.to === clickedNode.id) {
                    edgeExists = true
                    break
                }
            }

            if (edgeExists) {
                alert("Edge already exists between these nodes.")
                return
            }

            // if code reaches here, confirmed no edge exists

            const weightInput = prompt("Enter edge weight: ")
            const weight = parseFloat(weightInput)

            if (isNaN(weight)) {
                alert("Invalid weight. Please enter a number.")
                setSelectedNode(null)
                return
            }

            const newEdge = { from: selectedNode.id, to: clickedNode.id, weight}
            setEdges([...edges, newEdge])
            setSelectedNode(null)
        }
    }

    return (
        <svg
            width="100%"
            height={CANVAS_HEIGHT}
            style={{cursor: "crosshair", background: "#f9f9f9"}}
            onClick={handleCanvasClick}
        >
            <defs>
                <marker
                    id='arrowhead'
                    markerWidth={10}
                    markerHeight={7}
                    refX={10}
                    refY={3.5}
                    orient="auto"
                >
                    <polygon
                        points='0 0, 10 3.5, 0 7'
                        fill='gray'
                    />
                </marker>

                <marker
                    id='arrowhead-highlighted'
                    markerWidth={10}
                    markerHeight={7}
                    refX={10}
                    refY={3.5}
                    orient="auto"
                >
                    <polygon
                        points='0 0, 10 3.5, 0 7'
                        fill='orange'
                    />
                </marker>
            </defs>
            {/* drawing edges first so they are behind nodes */}
            {edges.map((edge, index) => {
                const fromNode = nodes.find(n => n.id === edge.from)
                const toNode = nodes.find( n => n.id === edge.to)
                if (!fromNode || !toNode) return null

                const highlighted = isEdgePartOfPath(result, edge.from, edge.to)
                const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x)

                const x1 = fromNode.x + NODE_RADIUS * Math.cos(angle)
                const y1 = fromNode.y + NODE_RADIUS * Math.sin(angle)
                const x2 = toNode.x - NODE_RADIUS * Math.cos(angle)
                const y2 = toNode.y - NODE_RADIUS * Math.sin(angle)

                const midX = (x1 + x2) / 2
                const midY = (y1 + y2) / 2

                return (
                    <g key={index}>
                        <line
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={highlighted ? 'orange' : 'gray'}
                            strokeWidth={highlighted ? 3 : 1.5}
                            markerEnd={highlighted ? "url(#arrowhead-highlighted)" : "url(#arrowhead)"}
                        />
                        <text
                            x={midX}
                            y={midY - 8}
                            textAnchor='middle'
                            fontSize={12}
                            fill='black'
                        >
                            {edge.weight}
                        </text>
                    </g>
                )
            })}

            {/* drawing nodes */}
            {nodes.map((node) => {
                const highlighted = isNodePartOfPath(result, node.id)
                const isSelected = selectedNode && selectedNode.id === node.id
                
                return (
                    <g 
                        key={node.id}
                        onClick={(e) => {
                            e.stopPropagation()
                            handleNodeClick(node)
                        }}
                    >
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={NODE_RADIUS}
                            fill={highlighted ? 'orange' : isSelected ? 'lightblue' : 'white'}
                            stroke={isSelected ? 'blue' : 'black'}
                            strokeWidth={isSelected ? 2.5 : 1.5}
                        />
                        <text
                            x={node.x}
                            y={node.y}
                            textAnchor='middle'
                            dominantBaseline='central'
                            fontSize={14}
                            fontWeight="bold"
                            fill='black'
                        >
                            {node.id}
                        </text>
                    </g>
                )
            })}

        </svg>
    )
}