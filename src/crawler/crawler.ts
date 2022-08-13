import { StatisticDataModel } from "../model/StatisticDataModel.js";

export interface IURL {
  shopid: number | null;
  shopname: string | null;
  itemid: number | null;
  itemname: string | null;
}

export interface CrawlerProperties {
  url: string;
  supportUrl: string;
}

export interface CrawlerMethods {
  getTitle: () => StatisticDataModel["productInfo"]["title"];
  getLocation: () => StatisticDataModel["location"];
  getStatistics: () => StatisticDataModel["productInfo"]["statistics"];
  getImages: () => StatisticDataModel["productInfo"]["images"];
  getPrices: () => StatisticDataModel["productInfo"]["prices"];
  getDescription: () => StatisticDataModel["productInfo"]["description"];
  getCategories: () => StatisticDataModel["productInfo"]["categories"];
  getIsCOD: () => StatisticDataModel['isCOD']
  getShopId: () => StatisticDataModel['shopId']
  getShopName: () => StatisticDataModel['supplierName']
  getItemId: () => StatisticDataModel['productInfo']['id']
  getShopProductCount: () => StatisticDataModel['supplierInfo']['productCount']
  getShopAvatar: () => StatisticDataModel['supplierInfo']['shopAvatarURL']
  _initData: (url: string) => Promise<void>;

  getFullData(): StatisticDataModel;
}
