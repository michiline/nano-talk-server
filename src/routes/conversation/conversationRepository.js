import mongoose from 'mongoose'
import Conversation from './conversationModel'

export default {
  create ({ userIds }) {
    const docs = [{
      userIds: [
        mongoose.Types.ObjectId(userIds[0]),
        mongoose.Types.ObjectId(userIds[1])
      ]
    }]
    const options = {}
    return Conversation.create(docs, options)
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
  },
  addMessages ({ conversationId, messages }) {
    const filter = {
      _id: mongoose.Types.ObjectId(conversationId)
    }
    let mongoMessages = messages.map(message => {
      message.userId = mongoose.Types.ObjectId(message.userId)
      return message
    })
    const update = {
      $push: {
        messages: {
          $each: mongoMessages
        }
      }
    }
    const options = {}
    return Conversation.updateOne(filter, update, options)
  },
  // take one conversation per time
  getUnreadMessages ({ conversationIds, lastConnected }) {
    let mongoConversationsIds = conversationIds.map(conversationId => mongoose.Types.ObjectId(conversationId))
    const match = {
      $match: {
        _id: {
          $in: mongoConversationsIds
        }
      }
    }
    const project = {
      $project: {
        messages: {
          $filter: {
            input: '$messages',
            as: 'message',
            cond: {
              $gte: ['$$message.created', lastConnected]
            }
          }
        }
      }
    }
    return Conversation.aggregate([match, project])
  }
}

// const data = {
//   userIds: [mongoose.Types.ObjectId(userIds[0]), mongoose.Types.ObjectId(userIds[1])],
//   messages: [{
//     text: text,
//     userId: mongoose.Types.ObjectId(userIds[0])
//   }]
// }
