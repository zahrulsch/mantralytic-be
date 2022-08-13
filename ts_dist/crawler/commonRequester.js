import got from 'got';
import { CookieJar } from "tough-cookie";
import { promisify } from "util";
const cookieJar = new CookieJar();
const cookiesExtender = got.extend({
    cookieJar: cookieJar,
});
const httpVersionExtender = got.extend({
    http2: true,
    retry: {
        limit: 3
    }
});
export const shopeeHeaders = {
    accept: "application/json",
    pragma: "no-cache",
    "accept-encoding": "gzip, deflate, br",
    "content-type": "application/json",
    "sec-ch-ua": '"Chromium";v="104", " Not A;Brand";v="99", "Microsoft Edge";v="104"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
};
export const cookieSetter = promisify(cookieJar.setCookie.bind(cookieJar));
export const customGot = got.extend(cookiesExtender, httpVersionExtender);
