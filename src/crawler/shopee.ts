import { GetShopShopee } from './../model/Response/GetShopShopee.js';
import { GetShopInfo } from './../model/Response/GetShopInfo.js';
import { GetItemShopee } from './../model/Response/GetItemShopee.js';
import { StatisticDataModel } from '../model/StatisticDataModel.js';
import { CrawlerMethods, CrawlerProperties, IURL } from './crawler.js';
import { cookieSetter, customGot, shopeeHeaders } from './commonRequester.js';
import { cookieFilePicker } from '../helper/filePicker.js';
import _ from 'lodash'

class Shopee implements CrawlerProperties, CrawlerMethods {
  readonly supportUrl: string = '';
  readonly url: string = '';
  
  private supportUrl2: string = '';
  private supportUrl3: string = ''
  private response: GetItemShopee | null = null
  private response3: GetShopShopee | null = null

  constructor(url: string) {
    this.url = url;
    this.supportUrl = "https://shopee.co.id/api/v4/item/get";
    this.supportUrl2 = "https://seller.shopee.co.id/api/v2/login/";
    this.supportUrl3 = "https://shopee.co.id/api/v4/product/get_shop_info"
  }

  private async getSupplierInfo() {
    const cookies = await cookieFilePicker()
    const { shopid } = this.parseURL()
  
    if (Array.isArray(cookies)) {
      for (const cookie of cookies) {
        await cookieSetter(`${cookie.name}=${cookie.value}`, 'https://shopee.co.id')
      }
    }
    const response = await customGot.get(this.supportUrl3, {
      headers: {...shopeeHeaders},
      searchParams: { shopid }
    }).json() as GetShopShopee

    return response
  }

  private async shopRequester() {
    const cookies = await cookieFilePicker()
  
    if (Array.isArray(cookies)) {
      for (const cookie of cookies) {
        await cookieSetter(`${cookie.name}=${cookie.value}`, 'https://seller.shopee.co.id')
      }
    }
    const response = await customGot.get(this.supportUrl2, {
      headers: {...shopeeHeaders}
    }).json() as GetShopInfo
    
    return response
  }

  private async requester() {
    const cookies = await cookieFilePicker()

    if (Array.isArray(cookies)) {
      for (const cookie of cookies) {
        await cookieSetter(`${cookie.name}=${cookie.value}`, 'https://shopee.co.id')
      }
    }

    const { itemid, shopid } = this.parseURL()
    const response = await customGot.get(this.supportUrl, {
      searchParams: { itemid, shopid },
      headers: { ...shopeeHeaders }
    }).json() as GetItemShopee

    return response
  }

  private parseURL(): IURL {
    const { pathname } = new URL(this.url)
    let [_, pathOne, maybeShopId, maybeItemId] = pathname.split('/')
    
    if (!maybeItemId && !maybeShopId) {
      const itemid = pathOne.match(/([0-9]+)$/)
      const shopid = pathOne.match(/([0-9]+).[0-9]+$/)

      if (itemid) maybeItemId = itemid[0]
      if (shopid) maybeShopId = shopid[1]
    }

    return {
      itemname: '',
      shopname: '',
      itemid: Number(maybeItemId),
      shopid: Number(maybeShopId),
    }
  }

  private parseSupplierUrl(): string {
    if (!this.response3) return ""
    return `https://shopee.co.id/${this.response3.data.account.username}`
  }

  async _initData(): Promise<void> {
    this.response = await this.requester()
    this.response3 = await this.getSupplierInfo()
  }

  getTitle(): string | null {
    if (!this.response) return null
    return this.response.data.name;
  }

  getLocation(): string | null {
    if (!this.response) return null;
    return this.response.data.shop_location;
  }

  getStatistics(): { views: number | null; solds: number | null; successTransactions: number | null; rejectTransactions: number | null; } | null {
    if (!this.response) return null;
    return {
      rejectTransactions: null,
      solds: this.response.data.historical_sold,
      successTransactions: this.response.data.item_rating.rating_count.reduce((prev, current) => prev + current, 0),
      views: null
    }
  }

  getImages(): { desc: string; url: string; }[] | null {
    if (!this.response) return null
    const mainImages = this.response.data.images
    const varImages = this.response.data.tier_variations.filter(tv => tv.images)

    const mainImagesParsed: { desc: string; url: string; }[] = mainImages.map(mi => ({ desc: '', url: `https://cf.shopee.co.id/file/${mi}` }))
    const varImagesParsed: { desc: string; url: string; }[] = _.reduce(varImages, (prev, current) => {
      let arrayParsed = [] as { desc: string; url: string; }[]

      if (current.options && current.images) {
        arrayParsed = _.zipWith([...current.options], [...current.images], (a, b) => {
          return { url: `https://cf.shopee.co.id/file/${b}`, desc: a }
        })
      }

      return [...prev, ...arrayParsed]
    }, ([] as { desc: string; url: string; }[]))

    return [...mainImagesParsed, ...varImagesParsed]
  }

  getPrices(): number[] | null {
    if (!this.response) return null
    const prices = _.map(this.response.data.models, (m) => m.price)
    return [Math.min(...prices), Math.max(...prices)].reduce((prev, current) => 
      !prev.includes(current) ? [...prev, current] : prev
    , ([] as number[])).map(p => p / 100_000)
  }

  getDescription(): string | null {
    if (!this.response) return null
    return this.response.data.description
  }

  getCategories(): string[] | null {
    if (!this.response) return null
    return this.response.data.categories.map(c => c.display_name)
  }

  getIsCOD(): boolean | null {
    if (!this.response) return null
    return this.response.data.cod_flag === 1 ? true : false
  }

  getShopId(): string | number | null {
    if (!this.response) return null
    return this.response.data.shopid
  }

  getShopName(): string | null {
    if (!this.response3) return null
    return this.response3.data.account.username
  }

  getItemId(): string | number | null {
    const { itemid } = this.parseURL()
    return itemid ? itemid : null
  }

  getShopProductCount(): number | null {
    if (!this.response3) return null
    return this.response3.data.item_count
  }

  getShopAvatar(): string | null {
    if (!this.response3) return null
    return `https://cf.shopee.co.id/file/${this.response3.data.account.portrait}`
  }

  getFullData(): StatisticDataModel {
    return {
      location: this.getLocation(),
      marketplace: 'shopee',
      originalUrl: this.url,
      shopId: this.getShopId(),
      productInfo: {
        categories: this.getCategories(),
        description: this.getDescription(),
        images: this.getImages(),
        prices: this.getPrices(),
        statistics: this.getStatistics(),
        title: this.getTitle(),
        id: this.getItemId()
      },
      supplierName: this.getShopName(),
      isCOD: this.getIsCOD(),
      supplierInfo: {
        productCount: this.getShopProductCount(),
        shopAvatarURL: this.getShopAvatar(),
        shopLocation: this.getLocation(),
        url: this.parseSupplierUrl()
      }
    }
  }
}

export default Shopee