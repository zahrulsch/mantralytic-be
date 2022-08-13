import { Router } from 'express'
import { CrawlController } from '../../controller/index.js'

const router = Router()

router.post('/crawl-to-collections', CrawlController.crawlToCollections)

export default router