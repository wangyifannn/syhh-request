export interface Url {
    base: string;
    mock: string;
}
export interface Env {
    isDevelopment: boolean;
}
export interface RequestInfo {
    error: number;
    noAuthority: number;
    timeout?: 20000;
}
export interface ErrorRes {
    code: number;
    message: string;
    res: any;
}
export declare function setRequestFun(env: Env, url: Url, req: RequestInfo, token: string): any;
