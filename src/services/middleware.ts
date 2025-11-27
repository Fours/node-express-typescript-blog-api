import type { Request, Response, NextFunction } from "express"
import { parse as uuidParse } from "uuid";

import type { Message } from "../types/types"


export function validateId(
  req:Request<{id: string}>, 
  res:Response<Message>, 
  next:NextFunction) {

  try {
    uuidParse(req.params.id)
    next()
  } catch {
    res.status(400).json({message: "Article id must be a valid uuid"})
  }
}