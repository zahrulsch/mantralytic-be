export interface ProductStatStat {
  solds: number;
  views: number;
  successTransaction: number
}

export type ProductStat = {
  productid: number;
  allStats: ProductStatStat;
  todayStats: ProductStatStat;
  dateTimestamp: number;
  created?: number;
  updated?: number;
};