export interface Components {
  product_content: {
    name: "product_content";
    type: "product_content";
    data: {
      name: string;
      price: {
        value: number;
        currency: string;
      };
      isCOD: boolean
    }[];
  };
  product_detail: {
    name: "product_detail";
    type: "product_detail";
    data: {
      content: {
        applink: string
        isAnnotation: boolean
        showAtFront: boolean
        subtitle: string
        title: string
      }[]
    }[];
  };
  product_media: {
    name: "product_media";
    type: "product_media";
    data: {
      media: {
        type: "image";
        urlThumbnail: string;
        videoUrl: string;
        prefix: string;
        suffix: string;
        description: string;
      }[];
      videos: any[];
    }[];
  };
  variant_options: {
    name: "variant_options"
    type: "variant"
    data: {
      children: {
        isCOD: boolean
        price: number
        productName: string
        productURL: string
      }[]
    }[]
  }
}

export type GetItemTokopedia = {
  data: {
    pdpGetLayout: {
      name: string;
      pdpSession: string;
      basicInfo: {
        alias: string;
        isQA: boolean;
        id: string;
        shopID: string;
        shopName: string;
        minOrder: number;
        maxOrder: number;
        weight: number;
        weightUnit: string;
        condition: string;
        status: string;
        url: string;
        needPrescription: boolean;
        catalogID: string;
        isLeasing: boolean;
        isBlacklisted: boolean;
        menu: {
          id: string;
          name: string;
          url: string;
          __typename: string;
        };
        category: {
          id: string;
          name: string;
          title: string;
          breadcrumbURL: string;
          isAdult: boolean;
          isKyc: boolean;
          minAge: number;
          detail: {
            id: string;
            name: string;
            breadcrumbURL: string;
            isAdult: boolean;
            __typename: string;
          }[];

          __typename: string;
        };
        txStats: {
          transactionSuccess: string;
          transactionReject: string;
          countSold: string;
          paymentVerified: string;
          itemSoldFmt: string;
          __typename: string;
        };
        stats: {
          countView: string;
          countReview: string;
          countTalk: string;
          rating: number;
          __typename: string;
        };
        __typename: string;
      };
      components: any[];
      __typename: string;
    };
  };
}[];
