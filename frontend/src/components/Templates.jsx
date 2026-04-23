import { useState } from "react"
import styles from "./Templates.module.css"

export default function Templates({templates, onLoad}) {
    const [selectedIndex, setSelectedIndex] = useState("")

    function handleLoad() {
        if (selectedIndex === "") return
        const template = templates[selectedIndex]
        onLoad(template.nodes, template.edges)
    }

    return (
        <div className={styles.container}>
            <span className={styles.label}>Templates</span>
            <select className={styles.select} value={selectedIndex} onChange={e => setSelectedIndex(e.target.value)}>
                <option value="" disabled>Select a template</option>
                {templates.map((t, i) => (
                    <option key={i} value={i}>{t.name}</option>
                ))}
            </select>
            <button className={styles.button} onClick={handleLoad} disabled={selectedIndex===""}>
                Load
            </button>
        </div>
    )
}