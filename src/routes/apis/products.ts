import { Router } from 'express'
import { ApiProductController } from '../../controller/apis/ApiProductController.js'

const router = Router()

router.get('/', ApiProductController.findAllProduct)
router.get('/props/:id', ApiProductController.findProductPropOf)

export default router