import mongoose from 'mongoose'

const Schema = mongoose.Schema
const userSchema = new Schema(
  {
    conversations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
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
