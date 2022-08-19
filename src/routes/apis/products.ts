import { Router } from 'express'
import { ApiProductController } from '../../controller/apis/ApiProductController.js'

const router = Router()

router.get('/', ApiProductController.findAllProduct)

export default router