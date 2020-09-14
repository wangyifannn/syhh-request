import axios from 'axios'
export interface Url {
  base: string
  mock: string
}
export interface Env {
  isDevelopment: boolean
}
export type SuccessCode = 200 | 201 | 202 | 204 
export type ErrorCode = 400 | 401 | 403 | 404 | 406 | 410 | 422 | 500 | 502 | 503 | 504 

export type CodeNumber = SuccessCode | ErrorCode 

export type CodeType = 'success' | 'error'
export interface CodeMessage {
    200: '服务器成功返回请求的数据',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器',
    502: '网关错误',
    503: '服务不可用，服务器暂时过载或维护',
    504: '网关超时',
}

export interface CodeInfo {
  error: ErrorCode,
  success:SuccessCode,
  message: CodeMessage[CodeNumber],
  type?: CodeType,
  noAuthority: 40001,
  timeout: 20000,
}

export function setRequestFun(env:Env, url:Url, code:CodeInfo, token:string) {

  const service = axios.create({
    baseURL: url.base, // url = base url + request url
    timeout: code.timeout // request timeout
  })

  // request interceptor
  service.interceptors.request.use(
    config => {
      config= Object.assign({},config,{mock:''})
      // do something before request is sent
      // 使用mock地址或者真实地址
      // @ts-ignore
      if (env.isDevelopment && config&& config.mock) {
        config.url = url.mock + config.url
      }

      if (token) {
        // let each request carry token
        // ['Authorization'] is a custom headers key
        // please modify it according to the actual situation
        config.headers['Authorization'] =token
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
      if (config.url && config.url.indexOf(config.baseURL ? config.baseURL : '') > -1 && res.code !== code.error) {
        // 没有 api 权限
        if (res.code === code.noAuthority) {
          return Promise.reject({code:code.noAuthority,res:res})
        }
        // 403 超时的访问 401 未授权的访问
        if (res.code === code.error) {
          return Promise.reject({code:code.error,res:res})
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
