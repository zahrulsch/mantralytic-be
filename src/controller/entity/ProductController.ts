import { MProduct } from './../../schema/product.js';
import { Product } from "../../model/Schema/Product.js";
import { Types } from 'mongoose';

export class ProductController {
  static async inputProduct(product: Product) {
    const findOldProduct = await MProduct.findOne({id: product.id})

    if (!findOldProduct) {
      const productDoc = await MProduct.create(product)
      return productDoc
    }

    await ProductController.updateProduct(findOldProduct._id, product)

    return null
  }

  static async updateProduct(_id: Types.ObjectId, product: Product) {
    const { id, marketplace, supplierInfo } = product

    await MProduct.updateOne({ _id }, {
      id, marketplace, supplierInfo
    })

    return true
  }
}