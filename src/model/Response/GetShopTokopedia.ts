export type GetShopTokopedia = {
  data: {
    pdpGetData: {
      shopInfo: {
        activeProduct: string;
        shopTier: number;
        badgeURL: string;
        createInfo: {
          epochShopCreated: string;
          __typename: string;
        };
        shopAssets: {
          avatar: string;
          __typename: string;
        };
        shopCore: {
          domain: string;
          shopID: string;
          name: string;
          shopScore: number;
          url: string;
          ownerID: string;
          __typename: string;
        };
        shopLastActive: string;
        location: string;
        statusInfo: {
          statusMessage: string;
          shopStatus: number;
          isIdle: boolean;
          __typename: string;
        };
        shopType: number;
        __typename: string;
      };
      __typename: string;
    };
  };
}[];
