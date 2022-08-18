import mongoose from 'mongoose';
import type { ProductStat, ProductStatStat } from '../model/Schema/ProductStat.js';
import { fullDate, onlyDate } from '../utils/date.js';

const productStatStatSchema = new mongoose.Schema<ProductStatStat>({
  solds: {
    type: Number,
    required: true,
  },
  views: {
    type: Number,
    required: true,
  },
  successTransaction: {
    type: Number,
    required: true
  }
});

const productStatSchema = new mongoose.Schema<ProductStat>({
  productid: {
    type: Number,
    required: true
  },
  allStats: {
    type: productStatStatSchema,
    required: true
  },
  todayStats: {
    type: productStatStatSchema,
    required: true
  },
  dateTimestamp: {
    type: Number,
    default: onlyDate()
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

productStatSchema.pre('updateOne', function() {
  this.set({ updated: fullDate() })
})

export const MProductStat = mongoose.model('ProductStats', productStatSchema) 