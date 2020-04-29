import mongoose from 'mongoose'

const Schema = mongoose.Schema
const userSchema = new Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
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

export default mongoose.model('Conversation', userSchema)
