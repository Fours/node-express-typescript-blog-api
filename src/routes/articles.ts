import express from "express"
import { getArticles } from "../utils/service"

import type { Request, Response, Router  } from "express"
import type { Article } from "../types/types"

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



