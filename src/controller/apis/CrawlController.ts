import type { Request, Response, NextFunction } from 'express'
import { ProductController } from './../entity/ProductController.js';
import { ProductPropController } from './../entity/ProductPropController.js';
import { ProductStatController } from './../entity/ProductStatController.js';
import { urlIdentifier } from './../../helper/urlIdentifier.js';
import { logEmiter } from './../../utils/socket.js';
import { onlyDate } from '../../utils/date.js';
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

    const {
      marketplace,
      productInfo,
      shopId,
      supplierInfo,
      supplierName,
      isCOD,
    } = engine.getFullData()
    const { id, title, categories, images, prices, statistics } = productInfo
    const { productCount, shopAvatarURL, shopLocation, url: urlSupp } = supplierInfo

    const productInputer = await ProductController.inputProduct({
      id: id && id !== null && +id || 0,
      marketplace: marketplace,
      supplierInfo: {
        avatar: shopAvatarURL || "",
        location: shopLocation || "",
        name: supplierName || "",
        productCount: productCount || 0,
        shopid: shopId && shopId !== null && String(shopId) || "",
        url: urlSupp
      },
      dateTimestamp: onlyDate()
    })

    const productPropInputer = await ProductPropController.inputProductProp({
      categories: categories || [],
      images: images || [],
      isCOD: isCOD || false,
      name: title || '',
      originalUrl: url,
      prices: prices || [],
      productid: id && id !== null && Number(id) || 0,
      dateTimestamp: onlyDate()
    })

    const productStatInputer = await ProductStatController.inputProductStat({ 
      productid: id && id !== null && +id || 0,
      dateTimestamp: onlyDate(),
      allStats: {
        solds: statistics?.solds || 0,
        views: statistics?.views || 0,
        successTransaction: statistics?.successTransactions || 0,
      }
     })

    if (productPropInputer) {
      logEmiter("log", {
        marketplaceType: '',
        status: "success",
        title: `Creating product 🧬 prop record of ${ title } ↩`,
        type: "crawler",
        url: url
      })
    } else {
      logEmiter("log", {
        marketplaceType: '',
        status: "info",
        title: `Updating product 🧬 prop record of ${ title } ↩`,
        type: "crawler",
        url: url
      })
    }

    if (productStatInputer) {
      logEmiter("log", {
        marketplaceType: '',
        status: "success",
        title: `Creating product 📊 stat record of ${ title } ↩`,
        type: "crawler",
        url: url
      })
    } else {
      logEmiter("log", {
        marketplaceType: '',
        status: "info",
        title: `Updating product 📊 stat record of ${ title } ↩`,
        type: "crawler",
        url: url
      })
    }

    if (productInputer) {
      logEmiter("log", {
        marketplaceType: marketplace,
        status: "success",
        title: title || "",
        type: "crawler",
        url: url
      })
    } else {
      logEmiter("log", {
        marketplaceType: marketplace,
        status: "info",
        title: `Update saved : ${title}`,
        type: "crawler",
        url: url
      })
    }
  } catch (e) {
    const err = e as any

    console.log(err)

    logEmiter('log', {
      marketplaceType: urlType,
      status: 'error',
      title: err.name || 'unknown',
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
          concurrency: 10
        })
      }

      res.send('success').status(200)
    } catch (e) {
      next(e)
    }
  }
}

export default CrawlController