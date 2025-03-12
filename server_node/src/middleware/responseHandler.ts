import { Middleware, ParameterizedContext } from 'koa';

export enum ResponseCode {
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

const successResponse = (ctx: ParameterizedContext, data: any) => {
  ctx.response.status = 200;
  ctx.body = {
    message: 'success',
    code: ResponseCode.success,
    data,
  };
};

const errorResponse = (ctx: ParameterizedContext, message: string, code: ResponseCode) => {
  ctx.response.status = 200;
  ctx.body = {
    message: 'error',
    code,
    data: {
      message,
    },
  };
};

const apiErrorResponse = (ctx: ParameterizedContext, message: string) => {
  errorResponse(ctx, message, ResponseCode.apiError);
};

const bizErrorResponse = (ctx: ParameterizedContext, message: string) => {
  errorResponse(ctx, message, ResponseCode.bizError);
};

const responseMiddleware: Middleware = async (ctx, next) => {
  ctx.success = (data = null) => successResponse(ctx, data);
  ctx.bizError = (message) => bizErrorResponse(ctx, message);
  ctx.apiError = (message) => apiErrorResponse(ctx, message);
  await next();
};

export default responseMiddleware;
