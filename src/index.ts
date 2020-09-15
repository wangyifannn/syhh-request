import axios from 'axios'
export interface Url {
  base: string
  mock: string
}
export interface Env {
  isDevelopment: boolean
}
// export type SuccessCode = 200 | 201 | 202 | 204 
// export type ErrorCode = 400 | 401 | 403 | 404 | 406 | 410 | 422 | 500 | 502 | 503 | 504 

// export type CodeNumber = SuccessCode | ErrorCode 

export interface RequestInfo {
  error: number,
  noAuthority: number,
  timeout?: 20000,
}
export interface ErrorRes {
  code: number,
  message:string,
  res: any
}
export function setRequestFun(env:Env, url:Url, req:RequestInfo, token:string):any {
  const service = axios.create({
    baseURL: url.base, // url = base url + request url
    timeout: req.timeout // request timeout
  })
  // request interceptor
  service.interceptors.request.use(
    config => {
      // do something before request is sent
      // 使用mock地址或者真实地址
      // @ts-ignore
      if (env.isDevelopment && config && config.mock) {
        config.url = url.mock + config.url
      }

      if (token) {
        // let each request carry token
        // ['Authorization'] is a custom headers key
        // please modify it according to the actual situation
        config.headers['Authorization'] = token
      }

      return config
    },
    error => {
      // do something with request error
      console.log(error) // for debug
      return Promise.reject(error)
    }
  )

  // response interceptor
  service.interceptors.response.use(
    response => {
      const config = response.config
      const res = response.data
      // if the custom code is not 20000, it is judged as an error.
      if (config.url && config.url.indexOf(config.baseURL ? config.baseURL : '') > -1 && res.code !== req.error) {
        // 没有 api 权限
        if (res.code === req.noAuthority) {
          return Promise.reject({code:req.noAuthority,res:res, message: res.message} as ErrorRes)
        }
        // 403 超时的访问 401 未授权的访问
        if (res.code === req.error) {
          return Promise.reject({code:res.code,res:res, message: res.message} as ErrorRes)
        }
        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        return res
      }
    },
    error => {
      return Promise.reject(error)
    }
  )
  return service
}
