import User from './userModel'

export default {
  create (data) {
    const user = new User(data)
    return user.save()
  },
  get (query) {
    return User.find(query)
  },
  update (id, data) {
    data.updated = Date.now()
    return User.findByIdAndUpdate(id, data, { new: true })
  }
}
