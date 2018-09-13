import { makeExecutableSchema } from "graphql-tools"

const { version } = require("../../package.json")

const resolvers = {
  Query: {
    books() {
      return [
        {
          title: "Harry Potter and the Chamber of Secrets",
          author: "J.K. Rowling"
        },
        {
          title: "Jurassic Park",
          author: "Michael Crichton"
        }
      ]
    },

    version() {
      return version
    }
  }
}

const typeDefs = `
  type Book {
    title: String
    author: String
  }

  type Query {
    version: String!
  }

  extend type Query {
    books: [Book]
  }
`

export default makeExecutableSchema({
  resolvers,
  typeDefs
})
