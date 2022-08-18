import { getTheDifference } from './../../utils/difference.js';
import { MProductProp } from './../../schema/productProp.js';
import type { ProductProp } from "../../model/Schema/ProductProp.js";

export class ProductPropController {
  static async inputProductProp(productProp: ProductProp) {
    const { productid, dateTimestamp, created: _a, updated: _b, ...rest } = productProp
    // find old record
    const find = await MProductProp.findOne(
      {
        productid,
      },
      {},
      {
        sort: {
          created: -1,
        },
      }
    );

    // if old record is not found
    if (!find) {
      // create new
      const creator = await MProductProp.create(productProp)
      return creator
    }

    const { name, images, categories, prices, isCOD, originalUrl } = find

    const diff = getTheDifference(rest, { name, images, categories, prices, isCOD, originalUrl })

    // if new record and old record is different or have been changed
    if (diff.length) {
      // update old / today recont
      const find = await MProductProp.findOneAndUpdate({
        productid, dateTimestamp
      }, { ...productProp })

      // create today record
      if (!find) {
        await MProductProp.create(productProp)
      }
    }

    return null
  }
}