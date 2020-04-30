import { userRepository } from '../user'
import { conversationRepository } from '../conversation'

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
  async createConversation (req, res, next) {
    try {
      const { userIds } = req.body
      const conversations = await conversationRepository.create({
        userIds
      })
      await userRepository.createConversation({
        userIds,
        conversationId: conversations[0]._id
      })
      res.data = {
        conversationId: conversations[0]._id
      }
      return next()
    } catch (err) {
      console.log(err)
      return next(err)
    }
  }
}
