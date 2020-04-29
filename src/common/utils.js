import { v4 as uuidv4 } from 'uuid'

export const millisToString = (date = new Date(Date.now())) => {
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  const month = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
  return `${day}/${month}/${date.getFullYear()} ${hours}:${minutes}:${seconds}`
}

export const tagRequest = (req, res, next) => {
  req.tag = uuidv4()
  return next()
}

export const logStartService = (service) => {
  console.log(`${millisToString()} - ${service} started`)
}

export const logStart = (service) => {
  console.log(`${millisToString()} - ${process.env.NAME || 'Server'} started on port ${process.env.PORT || 3001}`)
}

export const logRequest = (req, res, next) => {
  console.log(`${millisToString()} - ${req.method} ${req.originalUrl} - ${req.tag}`)
  return next()
}

export const setResponseHeaders = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PATCH')
  if (req.method === 'OPTIONS') {
    res.status(200).send('OK')
  } else {
    next()
  }
}

export const catchAppErrors = (err, req, res, next) => {
  if (err.type && err.type === 'entity.parse.failed') {
    return res.status(400).send({
      message: 'INVALID_JSON_DATA'
    })
  } else {
    console.log(err)
    return res.status(500).send({
      message: 'INTERNAL_SERVER_ERROR'
    })
  }
}
