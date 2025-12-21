import express, { Express, Request, Response } from "express"
import cors from "cors"
import { articlesRouter } from "./routes/articles"
import { tagsRouter } from "./routes/tags"
import { authorsRouter } from "./routes/authors"

import type { Message } from "./types/types"

const PORT = 8000
const app: Express = express()

app.use(cors())

app.use('/api/articles', articlesRouter)

app.use('/api/tags', tagsRouter)

app.use('/api/authors', authorsRouter)

app.use((req: Request, res: Response<Message>): void => {
    res.status(404).json({message: "No endpoint found"})
})

const server = app.listen(PORT, (): void => {
    console.log(`Listening on port: ${PORT}`)
})

module.exports = server; // for tests