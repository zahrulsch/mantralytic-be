import type { Request, Response, NextFunction } from 'express'
import { MProductProp } from './../../schema/productProp.js';
import { MProduct } from './../../schema/product.js';
import { MProductStat } from '../../schema/productStat.js';
import { fullDate } from '../../utils/date.js';

interface CommonFindProductRes {
  pid: number
  thumbnail: string
  name: string
  sold_count: number
  success_count: number
  marketplace_type: string
  prices: number[]
  created: number
  updated: number
  supplierinfo: {
    name: string
    url: string
    location: string
  }
}

export class ApiProductController {
  static async findAllProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const responses: CommonFindProductRes[] = []
      
      const productStats = (await MProductStat.find().sort({ updated: -1 })).filter((val, index, self) => {
        return self.map(s => s.productid).indexOf(val.productid) === index
      })
      
      for (const ps of productStats) {
        const response: CommonFindProductRes = {
          pid: ps.productid,
          sold_count: ps.allStats.solds,
          success_count: ps.allStats.successTransaction,
          updated: ps.updated || 0,
          name: "",
          thumbnail: "",
          created: 0,
          marketplace_type: "",
          prices: [],
          supplierinfo: {
            location: "",
            name: "",
            url: ""
          }
        };

        // find last product prop
        const productProp = await MProductProp.findOne({
          productid: ps.productid
        }, {}, {sort: { created: -1 }})

        if (productProp) {
          response.name = productProp.name
          response.thumbnail = productProp.images[0]?.url || ""
          response.prices = productProp.prices

          console.log(productProp.images)
        }

        // // find last product
        const product = await MProduct.findOne({
          id: ps.productid
        })

        if (product) {
          response.created = product.created || 0
          response.marketplace_type = product.marketplace
          response.supplierinfo = {
            location: product.supplierInfo.location,
            name: product.supplierInfo.name,
            url: product.supplierInfo.url
          }
        }

        responses.push(response)
      }

      res.status(200).json({
        data: responses,
        timestamp: fullDate(),
        count: productStats.length
      });
    } catch (e) {
      next(e)
    }
  }

  static async findProductPropOf(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const props = await MProductProp.findOne(
        { productid: +id, },
        {},
        { sort: { updated: -1, }, }
      );

      res.status(200).json({ data: props })
    } catch (e) {
      next(e)
    }
  }
}