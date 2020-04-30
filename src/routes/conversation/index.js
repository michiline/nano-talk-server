import express from 'express'

import conversationRepository from './conversationRepository'
import controller from './conversationController'
import { catchErrors, sendResponse } from '../../common'

const router = express.Router()

router.get('/',
  controller.get
)

router.post('/',
  controller.create
)

router.post('/message',
  controller.addMessages
)

router.use(catchErrors)
router.use(sendResponse)

export { router as conversationRouter, conversationRepository }
