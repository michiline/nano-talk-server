import mongoose from 'mongoose'

const Schema = mongoose.Schema

const messageSchema = new Schema(
  {
    text: {
      type: String
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' },
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
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
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
