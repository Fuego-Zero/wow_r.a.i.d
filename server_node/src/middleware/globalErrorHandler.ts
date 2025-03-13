import { isBizException } from '@yfsdk/web-basic-library';
import { Middleware } from 'koa';

function isValidationError(error: any): error is { message: string } {
  return error.name === 'ValidationError';
}

const globalErrorMiddleware: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (isBizException(error)) return ctx.bizError(error.message);
    if (isValidationError(error)) return ctx.bizError(error.message);
    console.error('Global Error Handler:', error);
    ctx.apiError((error as Error).message);
  }
};

export default globalErrorMiddleware;
