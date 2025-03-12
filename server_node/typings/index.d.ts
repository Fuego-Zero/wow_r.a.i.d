/// <reference types="@yfsdk/web-basic-library" />

/* eslint-disable @typescript-eslint/no-unused-vars */
import { DefaultContext } from 'koa';
import Router from 'koa-router';
import { ResponseCode } from 'src/middleware/responseHandler';

export interface CustomContextMethod {
  /**
   * 返回成功
   *
   * @param data
   */
  success(data: any = null): void;

  /**
   * 返回业务失败
   *
   * @param message
   */
  bizError(message: string): void;

  /**
   * 返回接口失败
   *
   * @param message
   */
  apiError(message: string): void;
}

declare module 'koa' {
  interface DefaultContext extends CustomContextMethod {}
}

declare module 'koa-router' {
  interface IRouterParamContext extends CustomContextMethod {}
}
