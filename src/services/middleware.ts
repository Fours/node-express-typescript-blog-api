import type { Request, Response, NextFunction } from "express"
import { parse as uuidParse } from "uuid";

import type { Article, Message } from "../types/types"

export function validateId(
    req: Request<{id: string}>, 
    res: Response<Message>, 
    next: NextFunction
): void {

    try {
        uuidParse(req.params.id)
        next()        
    } catch {
        res.status(400).json({message: "Article id must be a valid uuid"})
    }
}

export function validatePost(
    req: Request<{}, unknown, Omit<Article, "id" | "timestamp">>, 
    res: Response<Message>, 
    next: NextFunction    
): void {
    if (isValidPost(req.body)) {
        next()
    } else {
        res.status(400).json({
            message: "Article must include author: string, tags: string[], title: string, blurb: string, and body: string"
        })
    }
}

export function validatePut(
    req: Request<{}, unknown, Partial<Article>>, 
    res: Response<Message>, 
    next: NextFunction    
): void {
    const id = typeof req.body.id === "string" ? req.body.id : ""
    try {
        uuidParse(id)        
    } catch {
        res.status(400).json({
            message: "Article id must be present and be a valid uuid"
        })
        return
    }
    if (isValidPut(req.body)) {
        next()
    } else {
        res.status(400).json({
            message: "Invalid article properties"
        })
    }
}

export function isValidPost(payload: Omit<Article, "id" | "timestamp">): boolean {
    return (
        typeof payload.author === "string" &&
        isStringArray(payload.tags) &&
        typeof payload.title === "string" &&
        typeof payload.blurb === "string" &&
        typeof payload.body === "string"
    )
}

function isStringArray(tags: string[]) {
    return Array.isArray(tags) && tags.every(tag => {
        return typeof tag === 'string'
    })
}

function isValidPut(payload: Partial<Article>): boolean {
    
    return (payload.author === undefined || typeof payload.author === "string") &&
        (payload.tags === undefined || isStringArray(payload.tags)) &&
        (payload.title === undefined || typeof payload.title === "string") &&
        (payload.blurb === undefined || typeof payload.blurb === "string") && 
        (payload.body === undefined || typeof payload.body === "string")
}