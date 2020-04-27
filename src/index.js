import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { setResponseHeaders, tagRequest, logRequest, catchErrors, logStart } from './utils'
import { Example } from './routes'
import { runChat } from './chat'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const app = express()
const server = http.createServer(app)

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
app.use(bodyParser.json())
app.use(tagRequest)
app.use(logRequest)

// routes
app.use('/example', Example)

app.use(setResponseHeaders)
app.use(catchErrors)

runChat(server)

server.listen(process.env.PORT || 3001, () => logStart())
