import styles from './Controls.module.css'

export default function Controls({nodes, source, target, setSource, setTarget, onFindPath, onClear}) {
    return (
        <div className={styles.container}>
            <label className={styles.label}>Source: </label>
            <select className={styles.select} value={source} onChange={e => setSource(e.target.value)}>
                <option value="">Select source</option>
                {nodes.map(node => (
                    <option key={node.id} value={node.id}>{node.id}</option>
                ))}
            </select>

            <label className={styles.label}>Target: </label>
            <select className={styles.select} value={target} onChange={e => setTarget(e.target.value)}>
                <option value="">Select target</option>
                {nodes.map(node => (
                    <option key={node.id} value={node.id}>{node.id}</option>
                ))}
            </select>

            <button className={`${styles.button} ${styles.findButton}`} onClick={onFindPath}>Find Shortest Path</button>
            <button className={`${styles.button} ${styles.clearButton}`}onClick={onClear}>Clear Canvas</button>
        </div>
    )
}