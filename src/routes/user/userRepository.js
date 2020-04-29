import User from './userModel'
import mongoose from 'mongoose'

export default {
  create (data) {
    const user = new User(data)
    return user.save()
  },
  get (query) {
    return User.find(query)
  },
  createConversation ({ users, conversationId }) {
    const filter = {
      _id: [mongoose.Types.ObjectId(users[0]), mongoose.Types.ObjectId(users[1])]
    }
    const update = {
      $set: {
        updated: Date.now()
      },
      $push: {
        conversations: mongoose.Types.ObjectId(conversationId)
      }
    }
    const options = {}
    return User.updateMany(filter, update, options)
  }
  // updateOne (id, data) {
  //   data.updated = Date.now()
  //   return User.findByIdAndUpdate(id, data, { new: true })
  // }
}
