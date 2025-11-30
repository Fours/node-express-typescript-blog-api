import express from "express"
import { 
    addArticle, 
    deleteArticle, 
    getArticle, 
    getArticles, 
    replaceArticle 
} from "../services/service"
import { isValidPost, validateId, validatePost, validatePut } from "../services/middleware"
import { sanitizeStrings } from "../utils/input"

import type { Request, Response, Router  } from "express"
import type { Article, Message } from "../types/types"

type ArticleQueryParams = {
    author?: string
    tags?: string
}

export const articlesRouter: Router = express.Router()

articlesRouter.use(express.json());

articlesRouter.get("/", async (
    req: Request<{}, unknown, {}, ArticleQueryParams>, 
    res: Response<Article[]>
): Promise<void> => {

    const articles = await getArticles(req.query.author, req.query.tags)    
    res.json(articles)
})

articlesRouter.get("/:id", validateId, async (
    req: Request<{ id: string }>, 
    res: Response<Article | Message>
): Promise<void> => {

    const article = await getArticle(req.params.id)    
    if (article) {
        res.json(article)
    } else {
        res.status(404).json({
            message: "No article found with that id"
        })
    }
})

articlesRouter.post("/", validatePost,  async (
    req: Request<{}, unknown, Omit<Article, "id" | "timestamp">>,
    res: Response<Article>
): Promise<void> => {

    const sanitizedPayload = sanitizeStrings(req.body)
    const newArticle = {
        author: sanitizedPayload.author || "",
        tags: sanitizedPayload.tags || [],
        title: sanitizedPayload.title || "",
        blurb: sanitizedPayload.blurb || "",
        body: sanitizedPayload.body || ""
    }

    const article = await addArticle(newArticle)
    res.status(201).json(article)
})

articlesRouter.put("/", validatePut,  async (
    req: Request<{}, unknown, Partial<Article>>,
    res: Response<Article | Message>
): Promise<void> => {

    const partialArticle = req.body
    const result = await replaceArticle(partialArticle)
    if (result) {
        res.json(result)
    } else {
        const newArticle = partialArticle as Omit<Article, "id" | "timestamp">
        if (isValidPost(newArticle)) {
            const addedArticle = await addArticle(newArticle)
            res.status(201).json(addedArticle)
        } else {
            res.status(400).json({
                message: "Invalid article properties"
            })
        }
    }
})

articlesRouter.delete("/:id", validateId, async (
    req: Request<{ id: string }>, 
    res: Response<Message>
): Promise<void> => {

    const isFound = await deleteArticle(req.params.id)    
    if (isFound) {
        res.json({
            message: "Article deleted"
        })
    } else {
        res.status(404).json({
            message: "No article found with that id"
        })
    }
})



