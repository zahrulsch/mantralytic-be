import mongoose from "mongoose";
import { onlyDate, fullDate } from '../utils/date.js'
import type { Product } from "../model/Schema/Product.js";

const supplierInfoSchema = new mongoose.Schema<Product['supplierInfo']>({
  avatar: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  productCount: {
    type: Number,
    required: true
  },
  shopid: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
})

const productSchema = new mongoose.Schema<Product>({
  id: {
    type: Number,
    required: true
  },
  marketplace: {
    type: String,
    required: true,
    default: "shopee"
  },
  dateTimestamp: {
    type: Number,
    required: true,
    default: onlyDate()
  },
  supplierInfo: supplierInfoSchema,
  created: {
    type: Number,
    required: true,
    default: fullDate()
  },
  updated: {
    type: Number,
    required: true,
    default: fullDate()
  }
});

productSchema.pre('updateOne', function() {
  this.set({ updated:  fullDate()})
})

export const MProduct = mongoose.model('Product', productSchema)