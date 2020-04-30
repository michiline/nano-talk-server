import express from 'express'

import controller from './chatController'
import { catchErrors, sendResponse } from '../../common'

const router = express.Router()

router.post('/conversation',
  controller.createConversation
)

router.use(catchErrors)
router.use(sendResponse)

export { router as chatRouter }
