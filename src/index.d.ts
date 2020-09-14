export interface Url {
    base: string;
    mock: string;
}
export interface Env {
    isDevelopment: boolean;
}
export declare type SuccessCode = 200 | 201 | 202 | 204;
export declare type ErrorCode = 400 | 401 | 403 | 404 | 406 | 410 | 422 | 500 | 502 | 503 | 504;
export declare type CodeNumber = SuccessCode | ErrorCode;
export declare type CodeType = 'success' | 'error';
export interface CodeMessage {
    200: '服务器成功返回请求的数据';
    201: '新建或修改数据成功。';
    202: '一个请求已经进入后台排队（异步任务）';
    204: '删除数据成功。';
    400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。';
    401: '用户没有权限（令牌、用户名、密码错误）。';
    403: '用户得到授权，但是访问是被禁止的。';
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作';
    406: '请求的格式不可得。';
    410: '请求的资源被永久删除，且不会再得到的。';
    422: '当创建一个对象时，发生一个验证错误。';
    500: '服务器发生错误，请检查服务器';
    502: '网关错误';
    503: '服务不可用，服务器暂时过载或维护';
    504: '网关超时';
}
export interface CodeInfo {
    error: ErrorCode;
    success: SuccessCode;
    message: CodeMessage[CodeNumber];
    type?: CodeType;
    noAuthority: 40001;
    timeout: 20000;
}
export declare function setRequestFun(env: Env, url: Url, code: CodeInfo, token: string): import("axios").AxiosInstance;
