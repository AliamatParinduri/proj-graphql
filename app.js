require("dotenv/config")
const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const colors = require("colors")
const cors = require("cors")

const schema = require("./schema/schema")
const connectDB = require("./config/db")

const app = express()
const port = process.env.PORT || 5000

// Connect DB
connectDB()

app.use(cors())

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development" ? true : false,
  })
)

app.listen(port, console.log(`server running on http:localhost:${port}`))
