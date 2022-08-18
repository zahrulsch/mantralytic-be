export interface StatisticDataModel {
  marketplace: "shopee" | "tokopedia";
  originalUrl: string | null;
  shopId: number | string | null;
  supplierName: string | null;
  location: string | null;
  productInfo: {
    id: number | string | null
    title: string | null;
    statistics: {
      views: number | null;
      solds: number | null;
      successTransactions: number | null;
      rejectTransactions: number | null;
    } | null;
    images: { desc: string; url: string }[] | null;
    prices: number[] | null;
    categories: string[] | null;
    description: string | null;
  };
  isCOD: boolean | null
  supplierInfo: {
    shopLocation: string | null
    shopAvatarURL: string | null
    productCount: number | null
    url: string
  }
}