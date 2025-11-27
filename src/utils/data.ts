import fs from "node:fs/promises"
import path from "node:path"
import type { Article } from "../types/types"

export async function readData(): Promise<Article[]> {
    try { 
        const dataPath = path.join("dist", "data", "data.json")
        const data = await fs.readFile(dataPath, "utf8")
        return JSON.parse(data)
    } catch(err) {
        console.log(err)
        return []
    }
}

export async function writeData(data: Article[]): Promise<void> {    
    const dataPath = path.join("dist", "data", "data.json")    
    try {
        await fs.writeFile(
            dataPath,
            JSON.stringify(data, null, 2),
            "utf8")
    } catch(err) {
      console.log(err)
    }
}