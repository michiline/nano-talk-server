import conversationRepository from './conversationRepository'

export default {
  async get (req, res, next) {
    try {
      res.data = await conversationRepository.get(req.query)
      return next()
    } catch (err) {
      console.log(err)
      return next(err)
    }
  },
  async create (req, res, next) {
    try {
      const { userIds } = req.body
      res.data = await conversationRepository.create({
        userIds
      })
      return next()
    } catch (err) {
      console.log(err)
      return next(err)
    }
  },
  async addMessage (req, res, next) {
    try {
      const { conversationId, text, userId } = req.body
      res.data = await conversationRepository.addMessage({
        conversationId, text, userId
      })
      return next()
    } catch (err) {
      console.log(err)
      return next(err)
    }
  },
  async addMessages (req, res, next) {
    try {
      const { conversationId, messages } = req.body
      res.data = await conversationRepository.addMessages({
        conversationId, messages
      })
      return next()
    } catch (err) {
      console.log(err)
      return next(err)
    }
  }
}
