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

export async function addArticle(newArticle: Omit<Article, "id" | "timestamp">): Promise<Article> {
    
    const articles = await readData()
    const article: Article = {        
        id: uuidv4(),
        timestamp: Date.now(),
        ...newArticle        
    }
    articles.push(article)
    await writeData(articles)
    return article
}

export async function replaceArticle(partialArticle: Partial<Article>): Promise<Article | false> {
    
    const id = partialArticle.id ? partialArticle.id : ""
    const article = await getArticle(id)
    if (article) {
        const updatedArticle: Article = {
            id: article.id,
            timestamp: article.timestamp,
            author: partialArticle.author ? partialArticle.author : article.author,
            tags: partialArticle.tags ? partialArticle.tags : article.tags,
            blurb: partialArticle.blurb ? partialArticle.blurb : article.blurb,
            body: partialArticle.body ? partialArticle.body : article.body
        }
        const articles = await readData()
        const updatedArticles = articles.map(a => 
            a.id === updatedArticle.id ? updatedArticle : a)        
        await writeData(updatedArticles)
        return updatedArticle
    } else {
        return false
    }
}