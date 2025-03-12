import { BizException, isBizException } from '@yfsdk/web-basic-library';
import { Context } from 'koa';

import { ILoginBody } from '../interfaces/ILogin';
import UserService from '../services/UserService';

class UserController {
  private static validateLoginParams(body: any): asserts body is ILoginBody {
    if (!body) throw new BizException('body is undefined');
    const { account, password } = body as ILoginBody;

    if (!account) throw new BizException('body.account is undefined');
    if (!password) throw new BizException('body.password is undefined');
  }

  static async login(ctx: Context) {
    try {
      const { body } = ctx.request;

      UserController.validateLoginParams(body);
      const user = await UserService.login(body);

      ctx.success(user);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }

  static async getUserInfo(ctx: Context) {
    try {
      const user = await UserService.findUser(ctx.state.user.id);
      ctx.success(user);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }
}

export default UserController;
