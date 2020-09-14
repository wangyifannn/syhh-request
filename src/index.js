"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRequestFun = void 0;
const axios_1 = __importDefault(require("axios"));
function setRequestFun(env, url, code, token) {
    const service = axios_1.default.create({
        baseURL: url.base,
        timeout: code.timeout // request timeout
    });
    // request interceptor
    service.interceptors.request.use(config => {
        config = Object.assign({}, config, { mock: '' });
        // do something before request is sent
        // 使用mock地址或者真实地址
        // @ts-ignore
        if (env.isDevelopment && config && config.mock) {
            config.url = url.mock + config.url;
        }
        if (token) {
            // let each request carry token
            // ['Authorization'] is a custom headers key
            // please modify it according to the actual situation
            config.headers['Authorization'] = token;
        }
        return config;
    }, error => {
        // do something with request error
        console.log(error); // for debug
        return Promise.reject(error);
    });
    // response interceptor
    service.interceptors.response.use(response => {
        const config = response.config;
        const res = response.data;
        // if the custom code is not 20000, it is judged as an error.
        if (config.url && config.url.indexOf(config.baseURL ? config.baseURL : '') > -1 && res.code !== code.error) {
            // 没有 api 权限
            if (res.code === code.noAuthority) {
                return Promise.reject({ code: code.noAuthority, res: res });
            }
            // 403 超时的访问 401 未授权的访问
            if (res.code === code.error) {
                return Promise.reject({ code: code.error, res: res });
            }
            return Promise.reject(new Error(res.message || 'Error'));
        }
        else {
            return res;
        }
    }, error => {
        return Promise.reject(error);
    });
    return service;
}
exports.setRequestFun = setRequestFun;
