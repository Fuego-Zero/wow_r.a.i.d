import { BizException } from '@yfsdk/web-basic-library';
import { Middleware } from 'koa';

import { signKey } from '../config';
import { loginPath } from '../routes/login';
import sign from '../utils/Signature';

const signatureMiddleware: Middleware = async (ctx, next) => {
  if (process.env.SIGN_CHECK === 'false') return next();

  const {
    'sign-type': SIGN_TYPE,
    sign: SIGN,
    timestamp: TIMESTAMP,
    nonce: NONCE,
    authorization: TOKEN,
  } = ctx.request.headers;

  const { body: BODY } = ctx.request;
  const { query } = ctx.request;
  const signData = { TIMESTAMP, NONCE, BODY, TOKEN, ...query };

  if (TIMESTAMP === undefined) throw new BizException(`验证参数 TIMESTAMP 不正确: ${TIMESTAMP}`);
  if (NONCE === undefined) throw new BizException(`验证参数 NONCE 不正确: ${NONCE}`);
  if (SIGN === undefined) throw new BizException(`验证参数 SIGN 不正确: ${SIGN}`);
  if (SIGN_TYPE === undefined) throw new BizException(`验证参数 SIGN-TYPE 不正确: ${SIGN_TYPE}`);
  if (TOKEN === undefined && !ctx.path.startsWith(loginPath)) throw new BizException(`验证参数 TOKEN 不正确: ${TOKEN}`);

  const innerSign = sign(SIGN_TYPE as string, signKey, signData);

  const { SIGN_CHECK_TIME, NODE_ENV } = process.env;
  const currentDate = new Date().valueOf();
  const difference = SIGN_CHECK_TIME === 'false' ? Infinity : 5000;

  if (innerSign === SIGN && currentDate - +TIMESTAMP < difference) {
    await next();
  } else {
    throw new BizException(`改？${NODE_ENV === 'development' ? innerSign : ''}`);
  }
};

export default signatureMiddleware;
