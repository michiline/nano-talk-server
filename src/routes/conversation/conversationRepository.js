import mongoose from 'mongoose'
import Conversation from './conversationModel'

export default {
  create ({ users, text }) {
    const data = {
      users: [mongoose.Types.ObjectId(users[0]), mongoose.Types.ObjectId(users[1])],
      messages: [{
        text: text,
        user: mongoose.Types.ObjectId(users[0])
      }]
    }
    const conversation = new Conversation(data)
    return conversation.save()
  },
  get (query) {
    return Conversation.find(query)
  },
  addMessage ({ conversation, text, user }) {
    const filter = {
      _id: mongoose.Types.ObjectId(conversation)
    }
    const update = {
      $push: {
        messages: {
          text: text,
          user: mongoose.Types.ObjectId(user)
        }
      }
    }
    const options = {}
    return Conversation.updateOne(filter, update, options)
  }
}
