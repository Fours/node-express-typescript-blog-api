import { v4 as uuidv4 } from 'uuid';
import { readData, writeData } from "../utils/data";

import type { Article } from "../types/types"

export async function getArticles(
    author: string | undefined, 
    tags: string | undefined): Promise<Article[]> {
    
    let articles = await readData()
    
    if (author) {
        articles = articles.filter(article => {
            return author !== undefined && // unsure of why this check is needed
                author.toLowerCase() === article.author.toLowerCase()
        })
    }

    if (tags) {
        articles = articles.filter(article => {
            return tags.split(',').every(tag => {
                return article.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
            })
        })
    }

    return articles
}

export async function getArticle(id: string): Promise<Article | null> {
    
    const articles = await readData()
    const article = articles.find(article => article.id === id)
    
    return article ? article : null    
}

export async function addArticle(payload: Omit<Article, "id" | "timestamp">): Promise<void> {
    const articles = await readData()
    const article: Article = {        
        id: uuidv4(),
        timestamp: Date.now(),
        ...payload        
    }
    articles.push(article)
    await writeData(articles)
}