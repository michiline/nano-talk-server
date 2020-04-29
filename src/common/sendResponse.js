const sendResponse = (req, res, next) => {
  return res.status(200).send(res.data)
}

export default sendResponse
