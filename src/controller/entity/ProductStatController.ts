import { type ProductStat } from '../../model/Schema/ProductStat.js';
import { MProductStat } from '../../schema/productStat.js';
import { fullDate, onlyDate } from '../../utils/date.js';

export class ProductStatController {
  static async inputProductStat(productStat: Omit<ProductStat, "todayStats">) {
    const { productid, allStats, dateTimestamp } = productStat

    const find = await MProductStat.findOne(
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

    if (!find) {
      return await MProductStat.create({
        ...productStat,
        todayStats: {
          views: 0,
          solds: 0,
          successTransaction: 0,
        },
        created: onlyDate(0, 1),
        updated: onlyDate(0, 1),
        dateTimestamp: onlyDate(0, 1),
      });
    }

    const findDataYesterday = await MProductStat.findOne(
      {
        productid,
        dateTimestamp: {
          $lt: dateTimestamp,
        },
      },
      {},
      { sort: { created: -1 } }
    );

    if (findDataYesterday) {
      const { solds, successTransaction, views } = allStats
      const { solds: old_solds, successTransaction: old_success_transaction, views: old_views } = findDataYesterday.toJSON().allStats
  
      if (
        solds !== old_solds ||
        successTransaction !== old_success_transaction ||
        views !== old_views
      ) {
        const findAndUpdate = await MProductStat.findOneAndUpdate({
          productid, dateTimestamp
        }, {
          ...productStat,
          todayStats: {
            views: views - old_views,
            successTransaction: successTransaction - old_success_transaction,
            solds: solds - old_solds
          },
          updated: fullDate()
        })
  
        if (!findAndUpdate) {
          await MProductStat.create({
            allStats,
            dateTimestamp: onlyDate(),
            productid,
            todayStats: {
              views: views - old_views,
              successTransaction: successTransaction - old_success_transaction,
              solds: solds - old_solds
            }
          })
        }
      }
    }

    return null
  }
}