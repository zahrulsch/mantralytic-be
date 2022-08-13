export function generatePdpSession(shopid) {
    return JSON.stringify({
        sid: +shopid,
    });
}
export const getShopQuery = `query PDPGetDataP2(
  $productID: String!
  $pdpSession: String!
  $deviceID: String
  $userLocation: pdpUserLocation
  $affiliate: pdpAffiliate
) {
  pdpGetData(
    productID: $productID
    pdpSession: $pdpSession
    deviceID: $deviceID
    userLocation: $userLocation
    affiliate: $affiliate
  ) {
    shopInfo {
      activeProduct
      shopTier
      badgeURL
      createInfo {
        epochShopCreated
        __typename
      }
      shopAssets {
        avatar
        __typename
      }
      shopCore {
        domain
        shopID
        name
        shopScore
        url
        ownerID
        __typename
      }
      shopLastActive
      location
      statusInfo {
        statusMessage
        shopStatus
        isIdle
        __typename
      }
      shopType
      __typename
    }
    __typename
  }
}`;
