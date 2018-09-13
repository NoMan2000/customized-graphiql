import express from "express"
import graphql from "express-graphql"
import next from "next"

import schema from "./schema"

const pages = next({
  dev: process.env.NODE_ENV !== "production",
  dir: __dirname
})

const server = express()

// Nothing to see here...
server.get("/", (req, res) => {
  res.redirect(302, "/graphiql")
  res.end()
})

server.post(
  "/graphql",
  graphql({
    schema
  })
)

// Next.js is in charge!
server.use(pages.getRequestHandler())

// Don't listen until Next.js is ready...
pages.prepare().then(() =>
  server.listen(3000, () => {
    console.info(`🚀 Listening on http://localhost:3000/`)
  })
)
