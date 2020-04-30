import mongoose from 'mongoose'
import Conversation from './conversationModel'

export default {
  create ({ userIds, text }) {
    const data = {
      userIds: [mongoose.Types.ObjectId(userIds[0]), mongoose.Types.ObjectId(userIds[1])],
      messages: [{
        text: text,
        userId: mongoose.Types.ObjectId(userIds[0])
      }]
    }
    const conversation = new Conversation(data)
    return conversation.save()
  },
  get (query) {
    return Conversation.find(query)
  },
  addMessage ({ conversationId, text, userId }) {
    const filter = {
      _id: mongoose.Types.ObjectId(conversationId)
    }
    const update = {
      $push: {
        messages: {
          text: text,
          userId: mongoose.Types.ObjectId(userId)
        }
      }
    }
    const options = {}
    return Conversation.updateOne(filter, update, options)
  }
}
