import express from "express"
import { getArticle, getArticles } from "../services/service"
import { validateId } from "../services/middleware"

import type { Request, Response, Router  } from "express"
import type { Article, Message } from "../types/types"

type ArticleQueryParams = {
  author?: string
  tags?: string
}

export const articlesRouter: Router = express.Router()

articlesRouter.get('/', async (
  req:Request<{}, unknown, {}, ArticleQueryParams>, 
  res:Response<Article[]>): Promise<void> => {

    const articles = await getArticles(req.query.author, req.query.tags)    
    res.json(articles)
})

articlesRouter.get('/:id', validateId, async (
  req:Request<{ id: string}>, 
  res:Response<Article | Message>): Promise<void> => {

    const article = await getArticle(req.params.id)    
    if (article) {
      res.json(article)
    } else {
      res.status(404).json({
        message: "No article found with that id"
      })
    }
    
    
})



