import express from "express"
import { getAuthors } from "../services/service";

import type { Request, Response, Router  } from "express"

export const authorsRouter: Router = express.Router()

authorsRouter.get("/", async (
    req: Request, 
    res: Response<string[]>
): Promise<void> => {

    const authors = await getAuthors()    
    res.json(authors)
})