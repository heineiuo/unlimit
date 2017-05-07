export const DEV = process.env.NODE_ENV != 'production';
// export const DEV = true;
export const PROTOCOL = DEV?'http:':'https:';
export const ORIGIN_HOST =  `${PROTOCOL}//${DEV?'local.youkuohao.com':'www.youkuohao.com'}`;
export const API_HOST = `${ORIGIN_HOST}/api`;
