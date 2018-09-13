import express from "express"
import next from "next"

const dev = process.env.NODE_ENV !== "production"
const pages = next({ dev })
const server = express()

// Nothing to see here...
server.get("/", (req, res) => {
  res.redirect(302, "/graphiql")
  res.end()
})

// Next.js is in charge!
server.use(pages.getRequestHandler())

// Don't listen until Next.js is ready...
pages.prepare().then(() =>
  server.listen(3000, () => {
    console.info(`🚀 Listening on http://localhost:3000/`)
  })
)
