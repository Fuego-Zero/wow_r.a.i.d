import axios, { AxiosResponse } from "axios";
import { UserInfo } from "./types";
import { BizException } from "@yfsdk/web-basic-library";
import UserStorage from "../classes/UserStorage";

enum ResponseCode {
  /**
   * 成功
   */
  success = 1000,
  /**
   * 业务错误
   */
  bizError = 1001,
  /**
   * 接口错误
   */
  apiError = 1002,
}

export type HttpResponse<T = any> = AxiosResponse<
  | {
      code: ResponseCode.success;
      data: T;
      message: "success";
    }
  | {
      code: ResponseCode.bizError | ResponseCode.apiError;
      data: { message: string };
      message: "error";
    }
>;

const http = axios.create({
  baseURL: "http://localhost:3000/api2",
  timeout: 3000,
});

http.interceptors.request.use((config) => {
  if (config.url === "/login") return config;

  const token = UserStorage.getUser()?.token;
  if (!token) throw new BizException("请先登录");

  config.headers.Authorization = "Bearer " + token;

  return config;
});

http.interceptors.response.use((response: HttpResponse<UserInfo>): any => {
  if (response.data.code === ResponseCode.success) return response.data.data;
  throw new BizException(response.data.data.message);
});

export default http;
