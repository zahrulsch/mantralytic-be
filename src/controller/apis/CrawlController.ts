import type { Request, Response, NextFunction } from 'express'
import { urlIdentifier } from './../../helper/urlIdentifier.js';
import { logEmiter } from './../../utils/socket.js';
import pMap, { pMapSkip } from 'p-map';
import TokopediaCrawler from '../../crawler/tokopedia.js';
import ShopeeCrawler from '../../crawler/shopee.js';

interface CrawlToCollectionPaylaod {
  urls?: string[];
  colId?: number
}

async function crawler(url: string) {
  const urlType = urlIdentifier(url)
  try {
    let engine: undefined | TokopediaCrawler | ShopeeCrawler

    if (urlType === 'shopee') {
      engine = new ShopeeCrawler(url)
    } else {
      engine = new TokopediaCrawler(url)
    }

    await engine._initData()
    logEmiter({
      marketplaceType: urlType,
      status: 'success',
      title: engine.getTitle() || '',
      type: 'crawler',
      url
    })
  } catch {
    logEmiter({
      marketplaceType: urlType,
      status: 'error',
      title: 'unknown',
      type: 'crawler',
      url
    })
    return pMapSkip
  }
}

class CrawlController {
  static async crawlToCollections(_req: Request, res: Response, next: NextFunction) {
    try {
      const { colId, urls } = <CrawlToCollectionPaylaod>_req.body

      if (urls) {
        pMap(urls, crawler, {
          concurrency: 15
        })
      }

      res.send('success').status(200)
    } catch (e) {
      next(e)
    }
  }
}

export default CrawlController