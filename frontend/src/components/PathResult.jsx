import styles from './PathResult.module.css'

export default function PathResult({result, error}) {
    if (error) {
        return (
            <div className={styles.container}>
                <p classname={styles.error}>Error: {error}</p>
            </div>
        )
    }
    
    if (!result) {
        return (
            <div className={styles.container}>
                <p classname={styles.placeholder}> No path found yet. Build a graph and click Find Shortest Path.</p>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <h3 classname={styles.heading}>Shortest Path</h3>
            <p classname={styles.cost}>Cost: {result.cost}</p>
            <p classname={styles.path}>Path: {result.path.join(" ⟶ ")}</p>
        </div>
    )
}