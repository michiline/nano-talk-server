import express from 'express'

import userRepository from './userRepository'
import controller from './userController'
import { catchErrors, sendResponse } from '../../common'

const router = express.Router()

router.get('/',
  controller.get
)

router.post('/',
  controller.create
)

router.use(catchErrors)
router.use(sendResponse)

export { router as userRouter, userRepository }
