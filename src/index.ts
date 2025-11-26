import express, { Express, Request, Response } from "express"

const PORT = 8000
const app: Express = express()

type Message = {
  message: string
}

app.get('/api', (req: Request, res: Response): void => {
  res.json({});
});

app.use((req: Request, res: Response<Message>): void => {
  res.status(404).json({message: "No endpoint found"})
})

app.listen(PORT, (): void => {
  console.log(`Listening on port: ${PORT}`)
})