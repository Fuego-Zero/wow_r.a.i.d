import { isBizException } from '@yfsdk/web-basic-library';
import { Middleware } from 'koa';

const globalErrorMiddleware: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (isBizException(error)) ctx.bizError(error.message);
    console.error('Global Error Handler:', error);
    ctx.apiError((error as Error).message);
  }
};

export default globalErrorMiddleware;
