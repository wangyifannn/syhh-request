"use strict";

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setRequestFun = void 0;

var axios_1 = __importDefault(require("axios"));

function setRequestFun(env, url, req, token) {
  var service = axios_1["default"].create({
    baseURL: url.base,
    timeout: req.timeout // request timeout

  }); // request interceptor

  service.interceptors.request.use(function (config) {
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
  }, function (error) {
    // do something with request error
    console.log(error); // for debug

    return Promise.reject(error);
  }); // response interceptor

  service.interceptors.response.use(function (response) {
    var config = response.config;
    var res = response.data; // if the custom code is not 20000, it is judged as an error.

    if (config.url && config.url.indexOf(config.baseURL ? config.baseURL : '') > -1 && res.code !== req.error) {
      // 没有 api 权限
      if (res.code === req.noAuthority) {
        return Promise.reject({
          code: req.noAuthority,
          res: res,
          message: res.message
        });
      } // 403 超时的访问 401 未授权的访问


      if (res.code === req.error) {
        return Promise.reject({
          code: res.code,
          res: res,
          message: res.message
        });
      }

      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  }, function (error) {
    return Promise.reject(error);
  });
  return service;
}

exports.setRequestFun = setRequestFun;
