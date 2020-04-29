import { millisToString } from './utils'

export default (err, req, res, next) => {
  let errorMsg = 'INTERNAL_SERVER_ERROR'
  if (err.message) {
    errorMsg = err.message
  }
  console.log(`${millisToString()} - ${req.method} ${req.originalUrl} - ${req.tag} - ERROR: ${errorMsg}`)
  return res.status(statusCodes[errorMsg])
    .send({
      message: errorMsg
    })
}

const statusCodes = {
  'INVALID_DATA': 400,
  'INTERNAL_SERVER_ERROR': 500
}
