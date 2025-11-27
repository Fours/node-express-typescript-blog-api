import sanitizeHtml from "sanitize-html"

import type { Article } from "../types/types"

export function sanitizeStrings(data: Partial<Article>) {

    const sanitizedData: Partial<Article> = {}

    if (typeof data.author === "string") {
        sanitizedData.author = noTags(data.author)
    }

    if (typeof data.blurb === "string") {
        sanitizedData.author = noTags(data.blurb)
    }

    if (typeof data.body === "string") {
        sanitizedData.author = 
            sanitizeHtml(data.body, { allowedTags: ["p","b"], allowedAttributes: {}}).trim()
    }
    
    if (Array.isArray(data.tags)) {
        sanitizedData.tags = data.tags.map(tag => {
            if (typeof tag === "string") {
                return noTags(tag)
            } else {
                return tag
            }
        })
    }
    
    return sanitizedData
}

function noTags(value: string): string {
    return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {}}).trim()
}