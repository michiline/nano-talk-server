import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { setResponseHeaders, tagRequest, logRequest, catchAppErrors, logStart } from './common'
import { userRouter, conversationRouter } from './routes'
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
app.use('/api/user', userRouter)
app.use('/api/conversation', conversationRouter)

app.use(setResponseHeaders)
app.use(catchAppErrors)

runChat(server)

server.listen(process.env.PORT || 3001, () => logStart())
