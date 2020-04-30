import mongoose from 'mongoose'

const Schema = mongoose.Schema

const messageSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String
    },
    created: {
      type: Number,
      default: () => {
        return Date.now()
      }
    },
    updated: {
      type: Number,
      default: () => {
        return Date.now()
      }
    }
  }
)

const conversationSchema = new Schema(
  {
    userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [messageSchema],
    created: {
      type: Number,
      default: () => {
        return Date.now()
      }
    },
    updated: {
      type: Number,
      default: () => {
        return Date.now()
      }
    }
  }
)

export default mongoose.model('Conversation', conversationSchema)
