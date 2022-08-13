export type GetShopShopee = {
  bff_meta: any;
  error: any;
  error_msg: any;
  data: {
    shopid: number;
    userid: number;
    last_active_time: number;
    vacation: boolean;
    place: string;
    account: {
      portrait: string;
      username: string;
      status: number;
    };
    is_shopee_verified: boolean;
    is_preferred_plus_seller: boolean;
    is_official_shop: boolean;
    shop_location: string;
    item_count: number;
    rating_star: number;
    response_rate: number;
    session_info: any;
    name: string;
    ctime: number;
    response_time: number;
    follower_count: number;
    show_official_shop_label: boolean;
    rating_bad: number;
    rating_good: number;
    rating_normal: number;
    session_infos: any;
    show_shopee_mission: boolean;
    status: number;
  };
};
