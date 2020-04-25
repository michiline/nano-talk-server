import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { setResponseHeaders, tagRequest, logRequest, catchErrors, logStart } from './utils'
import { Example } from './routes'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const app = express()

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

app.listen(process.env.PORT || 3001, () => logStart())
