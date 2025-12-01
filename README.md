# Getting Started
Install the dependencies and run the project
```
npm install
npm run start
```

## About
This is a blog REST api built with javascript, Typescript, Node.js, and the Express framework, with Jest unit testing. It uses the file system as a simple data store. The api is written in Typescript and tests are written in js.

## Testing
Run unit tests
```
npm test
npm run coverage
```
## Endpoints

Get all articles with optional filters
```
GET /api/articles
GET /api/articles?author=name&tags=one,two
```

Get one article
```
GET /api/articles/{id}
```

Create new article
```
POST /api/articles

{
    "author": "Alice",
    "tags": ["one", "two"],
    "title": "Lorem Ipsum"
    "blurb": "Dolor sit amet.",
    "body": "<p>Dolor <b>sit</b> amet.</p>" // p and b tags allowed
}
```

Replace one or more article properties, or create a new one if none exists
```
PUT /api/articles
```

Delete one article
```
DELETE /api/articles/{id}
```

Get all authors
```
GET /api/authors
```

Get all tags
```
GET /api/tags
```