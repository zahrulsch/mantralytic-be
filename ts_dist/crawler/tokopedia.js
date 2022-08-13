import got from 'got';
import { getProductQuery } from "../queries/getProductQuery.js";
import { generatePdpSession, getShopQuery } from "../queries/getShopQuery.js";
class TokopediaCrawler {
    supportUrl = '';
    url = '';
    supportUrl2 = '';
    response = null;
    responseShop = null;
    constructor(url) {
        let objectURL = new URL(url);
        this.url = `${objectURL.origin}${objectURL.pathname}`;
        this.supportUrl = 'https://gql.tokopedia.com/graphql/PDPGetLayoutQuery';
        this.supportUrl2 = 'https://gql.tokopedia.com/graphql/PDPGetDataP2';
    }
    parseUrl() {
        if (!this.url)
            throw new Error('URL is empty');
        const { pathname } = new URL(this.url);
        const [_, shopname, itemname] = pathname.split('/');
        return {
            shopid: null,
            itemid: null,
            shopname: shopname && typeof shopname === 'string' ? shopname : null,
            itemname: itemname && typeof itemname === 'string' ? itemname : null
        };
    }
    headersGenerator() {
        return {
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "Windows",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
            "x-device": "desktop",
            "x-source": "tokopedia-lite",
            "x-tkpd-akamai": "pdpGetLayout",
            "x-tkpd-lite-service": "zeus",
            "x-version": "856db5b",
            origin: "https://www.tokopedia.com",
            pragma: "no-cache",
        };
    }
    payloadGenerator(type = 'getItem') {
        const { itemname, shopname } = this.parseUrl();
        let payload = {
            operationName: "PDPGetLayoutQuery",
            query: getProductQuery,
            variables: {
                apiVersion: 1,
                extParam: "",
                layoutID: "",
                productKey: itemname,
                shopDomain: shopname,
            },
        };
        if (type === 'getShop') {
            const shopid = this.getShopId();
            payload = {
                operationName: "PDPGetDataP2",
                query: getShopQuery,
                variables: {
                    productID: this.getItemId(),
                    pdpSession: generatePdpSession(shopid !== null ? shopid : 0),
                    affiliate: null,
                    deviceID: "",
                },
            };
        }
        return payload;
    }
    async requester() {
        const res = await got.post(this.supportUrl, {
            headers: this.headersGenerator(),
            json: [this.payloadGenerator()],
            timeout: {
                response: 10000
            }
        }).json();
        return res;
    }
    async shopRequester() {
        const res = await got.post(this.supportUrl2, {
            headers: this.headersGenerator(),
            json: [this.payloadGenerator('getShop')]
        }).json();
        return res;
    }
    async _initData() {
        const response = await this.requester();
        this.response = response;
        const shopResponse = await this.shopRequester();
        this.responseShop = shopResponse;
    }
    _getDataRequest() {
        return {
            headers: this.headersGenerator(),
            payload: [this.payloadGenerator()],
            supporturl: this.supportUrl
        };
    }
    getTitle() {
        if (!this.response)
            return null;
        const productContentArray = this.response[0].data.pdpGetLayout.components.filter(c => c.name === 'product_content')[0]?.data;
        if (!productContentArray)
            return null;
        return productContentArray[0].name?.replace(/\s-[a-zA-Z\s,0-9\/-_]*$/, '');
    }
    getDescription() {
        if (!this.response)
            return null;
        const productDetailArray = this.response[0].data.pdpGetLayout.components.filter(c => c.name === 'product_detail')[0]?.data;
        const productDescription = productDetailArray[0]?.content.filter(c => c.title === 'Deskripsi');
        if (!productDescription[0])
            return null;
        return productDescription[0].subtitle;
    }
    getLocation() {
        if (!this.responseShop)
            return null;
        if (!this.responseShop[0])
            return null;
        return this.responseShop[0].data.pdpGetData.shopInfo.location;
    }
    getCategories() {
        if (!this.response)
            return null;
        const categoryDetailArray = this.response[0].data.pdpGetLayout.basicInfo.category.detail;
        if (!categoryDetailArray)
            return null;
        return categoryDetailArray.map(cd => cd.name);
    }
    ;
    getPrices() {
        if (!this.response)
            return null;
        const variantOptionsArray = this.response[0].data.pdpGetLayout.components.filter(c => c.name === 'variant_options')[0].data;
        if (!variantOptionsArray[0]) {
            const productContentArray = this.response[0].data.pdpGetLayout.components.filter(c => c.name === 'product_content')[0]?.data;
            if (!productContentArray[0])
                return null;
            return [productContentArray[0].price.value];
        }
        const priceArray = variantOptionsArray[0].children.map(v => v.price);
        return [Math.min(...priceArray), Math.max(...priceArray)].reduce((prev, current) => {
            if (!prev.includes(current))
                prev = [...prev, current];
            return prev;
        }, []);
    }
    getStatistics() {
        if (!this.response)
            return null;
        if (!this.response[0])
            return null;
        const { countView } = this.response[0].data.pdpGetLayout.basicInfo.stats;
        const { countSold, transactionReject, transactionSuccess } = this.response[0].data.pdpGetLayout.basicInfo.txStats;
        return {
            rejectTransactions: Number(transactionReject),
            successTransactions: Number(transactionSuccess),
            solds: Number(countSold),
            views: Number(countView)
        };
    }
    getImages() {
        if (!this.response)
            return null;
        const productMediaArray = this.response[0].data.pdpGetLayout.components.filter(c => c.name === 'product_media')[0]?.data;
        if (!productMediaArray)
            return null;
        return productMediaArray[0].media.map(m => ({ desc: m.description, url: m.urlThumbnail }));
    }
    getIsCOD() {
        if (!this.response)
            return null;
        const productContentArray = this.response[0].data.pdpGetLayout.components.filter(c => c.name === 'product_content')[0]?.data;
        if (!productContentArray[0])
            return null;
        return productContentArray[0].isCOD;
    }
    getShopId() {
        if (!this.response)
            return null;
        if (!this.response[0])
            return null;
        return this.response[0].data.pdpGetLayout.basicInfo.shopID;
    }
    ;
    getShopName() {
        if (!this.response)
            return null;
        if (!this.response[0])
            return null;
        return this.response[0].data.pdpGetLayout.basicInfo.shopName;
    }
    getItemId() {
        if (!this.response)
            return null;
        if (!this.response[0])
            return null;
        return this.response[0].data.pdpGetLayout.basicInfo.id;
    }
    getShopProductCount() {
        if (!this.responseShop)
            return null;
        if (!this.responseShop[0])
            return null;
        return Number(this.responseShop[0].data.pdpGetData.shopInfo.activeProduct);
    }
    getShopAvatar() {
        if (!this.responseShop)
            return null;
        if (!this.responseShop[0])
            return null;
        return this.responseShop[0].data.pdpGetData.shopInfo.shopAssets.avatar;
    }
    getFullData() {
        return {
            location: this.getLocation(),
            marketplace: 'tokopedia',
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
                shopLocation: this.getLocation()
            }
        };
    }
}
export default TokopediaCrawler;
