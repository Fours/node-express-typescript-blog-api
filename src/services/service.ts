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
    const articles = await readData()
    const article = articles.find(article => article.id === id)
    if (article) {
        const updatedArticle: Article = {
            id: article.id,
            timestamp: article.timestamp,
            author: partialArticle.author !== undefined ? partialArticle.author : article.author,
            tags: partialArticle.tags !== undefined ? partialArticle.tags : article.tags,
            title: partialArticle.title !== undefined ? partialArticle.title : article.title,
            blurb: partialArticle.blurb !== undefined ? partialArticle.blurb : article.blurb,
            body: partialArticle.body !== undefined ? partialArticle.body : article.body
        }
        const updatedArticles = articles.map(a => 
            a.id === updatedArticle.id ? updatedArticle : a)        
        await writeData(updatedArticles)
        return updatedArticle
    } else {
        return false
    }
}

export async function deleteArticle(id: string): Promise<boolean> {

    const articles = await readData()   
    const article = articles.find(article => article.id === id)
    if (article) {
        const updatedArticles = articles.filter(article => article.id !== id)
        await writeData(updatedArticles)
        return true
    } {
        return false
    }     
}

export async function getTags(): Promise<string[]> {
    
    const articles = await readData()
    const tags = articles.reduce((acc: string[], article) => {
        return [...acc, ...article.tags]
    }, [])
    const tagsSet = new Set(tags)    
    return [...tagsSet]    
}