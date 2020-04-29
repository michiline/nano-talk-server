import conversationRepository from './conversationRepository'

export default {
  async get (req, res, next) {
    try {
      res.data = await conversationRepository.get(req.query)
      return next()
    } catch (err) {
      console.log(err)
      return next(err)
    }
  },
  async create (req, res, next) {
    try {
      res.data = await conversationRepository.create(req.body)
      return next()
    } catch (err) {
      console.log(err)
      return next(err)
    }
  }
  // async delete (req, res, next) {
  //   try {
  //     res.data = await userRepository.delete(req.params.id)
  //     return next()
  //   } catch (err) {
  //     console.log(err)
  //     return next(err)
  //   }
  // },
  // async update (req, res, next) {
  //   try {
  //     res.data = await userRepository.update(req.params.id, req.body)
  //     return next()
  //   } catch (err) {
  //     console.log(err)
  //     return next(err)
  //   }
  // }
}
