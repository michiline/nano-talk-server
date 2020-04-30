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
  createConversation ({ userIds, conversationId }) {
    const filter = {
      _id: [mongoose.Types.ObjectId(userIds[0]), mongoose.Types.ObjectId(userIds[1])]
    }
    const update = {
      $set: {
        updated: Date.now()
      },
      $push: {
        conversationIds: mongoose.Types.ObjectId(conversationId)
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
