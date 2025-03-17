import { BizException } from '@yfsdk/web-basic-library';

import User from '../models/User';
import { UserId } from '../types';

/**
 * 验证用户是否为管理员
 *
 * @param userId
 * @returns
 */
export async function validateUserAccess(userId: UserId): Promise<boolean> {
  const user = await User.findOne({ _id: userId });
  if (!user) throw new BizException('用户不存在');
  if (user.is_admin === false) throw new BizException('用户没有权限');
  return true;
}
