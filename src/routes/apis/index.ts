import { Router } from 'express'
import { CrawlController } from '../../controller/index.js'
import productRouter from './products.js'

const router = Router()

router.post('/crawl-to-collections', CrawlController.crawlToCollections)
router.use('/products', productRouter)

export default router