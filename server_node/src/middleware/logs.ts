import { isBizException, uuid } from '@yfsdk/web-basic-library';
import { Middleware } from 'koa';

import { accessLog, bizErrorLog } from '../utils/Log';

const logs: Middleware = async (ctx, next) => {
  const { sign = '', authorization: token = '' } = ctx.request.headers;
  const { body = {}, query = '', url, ip } = ctx.request;

  const traceId = (ctx.request.headers.traceid as string) ?? uuid().replace(/-/g, ''); /* cspell: disable-line */

  ctx.set('traceId', traceId);

  const startTime = Date.now().valueOf();

  try {
    await next();
    accessLog.record(traceId, ip, startTime, sign as string, body, query as string, url, token, ctx.body);
  } catch (error) {
    if (isBizException(error)) {
      bizErrorLog.record(
        traceId,
        ip,
        startTime,
        sign as string,
        body,
        query as string,
        url,
        token,
        error.message,
        error.stack,
      );
    }
    throw error;
  }
};

export default logs;
