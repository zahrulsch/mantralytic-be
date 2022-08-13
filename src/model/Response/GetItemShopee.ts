export type GetItemShopee = {
  error: null | string | number | boolean
  error_msg: null | string | number | boolean
  is_indexable: boolean
  data: GetItemShopeeData
}

interface ItemShopeeAttr {
  brand_option: any;
  id: number;
  is_timestamp: boolean;
  name: string;
  val_id: any;
  value: string;
}

interface ItemShopeeCats {
  catid: number;
  display_name: string;
  is_default_subcat: boolean;
  no_sub: boolean;
}

interface ItemShopeeInsurances {
  badge_text: string;
  insurance_product_id: string;
  product_detail_page_url: string;
  product_name: string;
}

interface ItemShopeeModel {
  itemid: number;
  status: number;
  current_promotion_reserved_stock: number;
  name: string;
  promotionid: number;
  price: number;
  price_stocks: {
    allocated_stock: null;
    stock_breakdown_by_location:
      | null
      | {
          location_id: string;
          available_stock: number;
          fulfilment_type: number;
          address_id: any;
        }[];
  }[];
  current_promotion_has_reserve_stock: boolean;
  normal_stock: number;
  extinfo: {
    tier_index: number[];
    group_buy_info: any;
    is_pre_order: boolean;
    estimated_days: number;
  };
  price_before_discount: number;
  modelid: number;
  stock: number;
  has_gimmick_tag: boolean;
  key_measurement: any;
}

interface ItemShopeeTierVar {
  name: string;
  options: string[] | null;
  images: string[] | null;
  properties: any;
  type: number;
  summed_stocks: number[] | null;
}

interface ItemShopeeVideoList {
  video_id: string;
  thumb_url: string;
  duration: number;
  version: number;
  vid: string;
  formats: { format: number; defn: string; profile: string; path: string; url: string; width: number; height: number; }[];
  default_format: { format: number; defn: string; profile: string; path: string; url: string; width: number; height: number; };
}

interface GetItemShopeeData {
  add_on_deal_info: any;
  attributes: ItemShopeeAttr[];
  badge_icon_type: number;
  brand: any;
  brand_id: number;
  bundle_deal_id: number;
  bundle_deal_info: any;
  can_use_bundle_deal: boolean;
  can_use_wholesale: boolean;
  categories: ItemShopeeCats[];
  catid: number;
  cb_option: number;
  cmt_count: number;
  cod_flag: number;
  coin_earn_label: any;
  coin_info: {
    coin_earn_items: any[];
    spend_cash_unit: number;
  };
  complaint_policy: any;
  condition: number;
  credit_insurance_data: {
    insurance_products: ItemShopeeInsurances[];
  };
  ctime: number;
  current_promotion_has_reserve_stock: boolean;
  current_promotion_reserved_stock: number;
  deep_discount: any;
  description: string;
  discount: string;
  discount_stock: number;
  estimated_days: number;
  exclusive_price_info: any;
  fe_categories: ItemShopeeCats[];
  flag: string;
  flash_sale: any;
  global_sold: string;
  group_buy_info: any;
  has_low_fulfillment_rate: boolean;
  has_lowest_price_guarantee: boolean;
  hidden_price_display: any;
  historical_sold: number;
  image: string;
  images: string[];
  invoice_option: any;
  is_adult: boolean;
  is_alcohol_product: boolean;
  is_cc_installment_payment_eligible: boolean;
  is_group_buy_item: any;
  is_infant_milk_formula_product: boolean;
  is_live_streaming_price: any;
  is_mart: boolean;
  is_non_cc_installment_payment_eligible: boolean;
  is_official_shop: boolean;
  is_partial_fulfilled: boolean;
  is_pre_order: boolean;
  is_preferred_plus_seller: boolean;
  is_prescription_item: boolean;
  is_service_by_shopee: boolean;
  item_has_post: boolean;
  item_has_video: true;
  item_rating: {
    rating_count: number[];
    rating_star: number;
  };
  item_status: string;
  item_type: number;
  itemid: number;
  label_ids: number[];
  liked: boolean;
  liked_count: number;
  lowest_past_price: any;
  makeups: any;
  min_purchase_limit: number;
  models: ItemShopeeModel[];
  name: string;
  normal_stock: number;
  other_stock: number;
  overall_purchase_limit: {
    end_date: any;
    item_overall_quota: any;
    order_max_purchase_limit: any;
    overall_purchase_limit: any;
    start_date: any;
  };
  pack_size: any;
  presale_info: any;
  preview_info: any;
  price: number;
  price_before_discount: number;
  price_max: number;
  price_max_before_discount: number;
  price_min: number;
  price_min_before_discount: number;
  raw_discount: number;
  reference_item_id: string;
  rich_text_description: any;
  shipping_icon_type: number;
  shop_location: string;
  shop_vouchers: any[];
  shopee_verified: boolean;
  shopid: number;
  should_show_amp_tag: boolean;
  show_best_price_guarantee: boolean;
  show_discount: number;
  show_free_shipping: boolean;
  show_official_shop_label_in_title: boolean;
  show_original_guarantee: boolean;
  show_recycling_info: boolean;
  show_shopee_verified_label: boolean;
  size_chart: string;
  size_chart_info: any;
  sold: number;
  sorted_variation_image_index_list: number[];
  spl_info: {
    channel_id: any;
    installment_info: any;
    show_spl: boolean;
    show_spl_lite: boolean;
    user_credit_info: any;
  };
  status: number;
  stock: number;
  tax_code: any;
  upcoming_flash_sale: any;
  userid: number;
  welcome_package_info: any;
  welcome_package_type: number;
  wholesale_tier_list: any[];
  wp_eligibility: any;
  tier_variations: ItemShopeeTierVar[];
  video_info_list: ItemShopeeVideoList[];
}