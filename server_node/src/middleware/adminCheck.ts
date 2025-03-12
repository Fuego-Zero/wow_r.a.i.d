import { BizException } from '@yfsdk/web-basic-library';
import { Middleware } from 'koa';

import { adminKey } from '../config';

const adminCheck: Middleware = async (ctx, next) => {
  const {
    url,
    headers: { admin },
  } = ctx;

  if (/^\/api\/configTable/.test(url) && admin !== adminKey) {
    throw new BizException('你没这个权限，滚蛋！');
  } else {
    await next();
  }
};

export default adminCheck;
