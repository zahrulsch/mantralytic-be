import { cookieSetter, customGot, shopeeHeaders } from './commonRequester.js';
import { cookieFilePicker } from '../helper/filePicker.js';
import _ from 'lodash';
class Shopee {
    supportUrl = '';
    url = '';
    supportUrl2 = '';
    supportUrl3 = '';
    response = null;
    response3 = null;
    constructor(url) {
        this.url = url;
        this.supportUrl = "https://shopee.co.id/api/v4/item/get";
        this.supportUrl2 = "https://seller.shopee.co.id/api/v2/login/";
        this.supportUrl3 = "https://shopee.co.id/api/v4/product/get_shop_info";
    }
    async getSupplierInfo() {
        const cookies = await cookieFilePicker();
        const { shopid } = this.parseURL();
        if (Array.isArray(cookies)) {
            for (const cookie of cookies) {
                await cookieSetter(`${cookie.name}=${cookie.value}`, 'https://shopee.co.id');
            }
        }
        const response = await customGot.get(this.supportUrl3, {
            headers: { ...shopeeHeaders },
            searchParams: { shopid }
        }).json();
        return response;
    }
    async shopRequester() {
        const cookies = await cookieFilePicker();
        if (Array.isArray(cookies)) {
            for (const cookie of cookies) {
                await cookieSetter(`${cookie.name}=${cookie.value}`, 'https://seller.shopee.co.id');
            }
        }
        const response = await customGot.get(this.supportUrl2, {
            headers: { ...shopeeHeaders }
        }).json();
        return response;
    }
    async requester() {
        const cookies = await cookieFilePicker();
        if (Array.isArray(cookies)) {
            for (const cookie of cookies) {
                await cookieSetter(`${cookie.name}=${cookie.value}`, 'https://shopee.co.id');
            }
        }
        const { itemid, shopid } = this.parseURL();
        const response = await customGot.get(this.supportUrl, {
            searchParams: { itemid, shopid },
            headers: { ...shopeeHeaders }
        }).json();
        return response;
    }
    parseURL() {
        const { pathname } = new URL(this.url);
        let [_, pathOne, maybeShopId, maybeItemId] = pathname.split('/');
        if (!maybeItemId && !maybeShopId) {
            const itemid = pathOne.match(/([0-9]+)$/);
            const shopid = pathOne.match(/([0-9]+).[0-9]+$/);
            if (itemid)
                maybeItemId = itemid[0];
            if (shopid)
                maybeShopId = shopid[1];
        }
        return {
            itemname: '',
            shopname: '',
            itemid: Number(maybeItemId),
            shopid: Number(maybeShopId),
        };
    }
    async _initData() {
        this.response = await this.requester();
        this.response3 = await this.getSupplierInfo();
    }
    getTitle() {
        if (!this.response)
            return null;
        return this.response.data.name;
    }
    getLocation() {
        if (!this.response)
            return null;
        return this.response.data.shop_location;
    }
    getStatistics() {
        if (!this.response)
            return null;
        return {
            rejectTransactions: null,
            solds: this.response.data.historical_sold,
            successTransactions: this.response.data.item_rating.rating_count.reduce((prev, current) => prev + current, 0),
            views: null
        };
    }
    getImages() {
        if (!this.response)
            return null;
        const mainImages = this.response.data.images;
        const varImages = this.response.data.tier_variations.filter(tv => tv.images);
        const mainImagesParsed = mainImages.map(mi => ({ desc: '', url: `https://cf.shopee.co.id/file/${mi}` }));
        const varImagesParsed = _.reduce(varImages, (prev, current) => {
            let arrayParsed = [];
            if (current.options && current.images) {
                arrayParsed = _.zipWith([...current.options], [...current.images], (a, b) => {
                    return { url: `https://cf.shopee.co.id/file/${b}`, desc: a };
                });
            }
            return [...prev, ...arrayParsed];
        }, []);
        return [...mainImagesParsed, ...varImagesParsed];
    }
    getPrices() {
        if (!this.response)
            return null;
        const prices = _.map(this.response.data.models, (m) => m.price);
        return [Math.min(...prices), Math.max(...prices)].reduce((prev, current) => !prev.includes(current) ? [...prev, current] : prev, []).map(p => p / 100_000);
    }
    getDescription() {
        if (!this.response)
            return null;
        return this.response.data.description;
    }
    getCategories() {
        if (!this.response)
            return null;
        return this.response.data.categories.map(c => c.display_name);
    }
    getIsCOD() {
        if (!this.response)
            return null;
        return this.response.data.cod_flag === 1 ? true : false;
    }
    getShopId() {
        if (!this.response)
            return null;
        return this.response.data.shopid;
    }
    getShopName() {
        if (!this.response3)
            return null;
        return this.response3.data.account.username;
    }
    getItemId() {
        const { itemid } = this.parseURL();
        return itemid ? itemid : null;
    }
    getShopProductCount() {
        if (!this.response3)
            return null;
        return this.response3.data.item_count;
    }
    getShopAvatar() {
        if (!this.response3)
            return null;
        return `https://cf.shopee.co.id/file/${this.response3.data.account.portrait}`;
    }
    getFullData() {
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
                shopLocation: this.getLocation()
            }
        };
    }
}
export default Shopee;
