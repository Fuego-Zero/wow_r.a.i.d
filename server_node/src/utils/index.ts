import { BizException } from '@yfsdk/web-basic-library';
import { Context } from 'koa';

import { UserId } from '../types';

export const getUserIdBy = (ctx: Context): UserId => {
  if (ctx.state.user) return ctx.state.user.id;
  throw new BizException('user is undefined');
};
