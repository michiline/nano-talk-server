import mongoose from 'mongoose'

const Schema = mongoose.Schema
const userSchema = new Schema(
  {
    conversationIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
    lastConnected: {
      type: Number,
      default: 0
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

export default mongoose.model('User', userSchema)
