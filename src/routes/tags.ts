import express from "express"
import { getTags } from "../services/service";

import type { Request, Response, Router  } from "express"

export const tagsRouter: Router = express.Router()

tagsRouter.get("/", async (
    req: Request, 
    res: Response<string[]>
): Promise<void> => {

    const tags = await getTags()    
    res.json(tags)
})