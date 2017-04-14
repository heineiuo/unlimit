export const __SMILE_DEV = global.__SMILE_DEV || process.env.NODE_ENV !== 'production';
// export const __SMILE_DEV = true;
export const PROTOCOL = __SMILE_DEV?'http:':'https:';
export const ORIGIN_HOST =  `${PROTOCOL}//${__SMILE_DEV?'local.youkuohao.com':'www.youkuohao.com'}`;
export const API_HOST = `${ORIGIN_HOST}/api`;
export const ACCOUNT_HOST = `${ORIGIN_HOST}/#/account`;
export const THIS_HOST = `${ORIGIN_HOST}`;