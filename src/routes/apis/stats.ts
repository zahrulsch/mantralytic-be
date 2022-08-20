import { Router } from 'express'
import { ApiStatController } from '../../controller/apis/ApiStatController.js'

const router = Router()

router.get('/', ApiStatController.getStatOfProduct)

export default router