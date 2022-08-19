export interface ProductSupplierInfo {
  name: string
  location: string
  shopid: string
  url: string
  avatar: string
  productCount: number
}

export type Product = {
  id: number
  marketplace: "shopee" | "tokopedia"
  supplierInfo: ProductSupplierInfo
  originalUrl: string
  dateTimestamp?: number
  created?: number
  updated?: number
}