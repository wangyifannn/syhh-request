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
export interface RequestInfo {
    error: ErrorCode;
    success: SuccessCode;
    noAuthority: 40001;
    timeout: 20000;
}
export interface ErrorRes {
    code: number;
    message: string;
    res: any;
}
export declare function setRequestFun(env: Env, url: Url, req: RequestInfo, token: string): any;
