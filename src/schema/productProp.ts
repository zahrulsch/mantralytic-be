import mongoose from 'mongoose';
import { onlyDate, fullDate } from '../utils/date.js';
import type { ProductProp, ProductPropImage } from '../model/Schema/ProductProp.js';

const productPropImageSchema = new mongoose.Schema<ProductPropImage>({
  desc: {
    type: String,
  },
  url: {
    type: String,
    required: true
  }
})

const productPropSchema = new mongoose.Schema<ProductProp>({
  productid: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  images: {
    type: [productPropImageSchema],
    default: []
  },
  categories: {
    type: [String],
    default: []
  },
  isCOD: {
    type: Boolean,
    default: false
  },
  originalUrl: {
    type: String,
    required: true,
  },
  dateTimestamp: {
    type: Number,
    default: onlyDate()
  },
  prices: {
    type: [Number],
    default: []
  },
  created: {
    type: Number,
    default: fullDate()
  },
  updated: {
    type: Number,
    default: fullDate()
  }
})

productPropSchema.pre('updateOne', function() {
  this.set({ updated:  fullDate()})
})

export const MProductProp = mongoose.model('ProductProps', productPropSchema)