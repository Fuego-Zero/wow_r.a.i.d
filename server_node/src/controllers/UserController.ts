import { BizException, isBizException } from '@yfsdk/web-basic-library';
import { Context } from 'koa';

import { ILoginBody } from '../interfaces/ILogin';
import { IChangePasswordBody, IChangeUserInfoBody } from '../interfaces/IUser';
import UserService from '../services/UserService';

class UserController {
  private static validateLoginParams(body: any): asserts body is ILoginBody {
    if (!body) throw new BizException('body is undefined');
    const { account, password } = body as ILoginBody;

    if (!account) throw new BizException('body.account is error');
    if (!password) throw new BizException('body.password is error');
  }

  private static validateChangePasswordParams(body: any): asserts body is IChangePasswordBody {
    if (!body) throw new BizException('body is undefined');
    const { password } = body as IChangePasswordBody;

    if (!password) throw new BizException('body.password is error');
    if (password.length !== 64) throw new BizException('password length error');
  }

  private static validateChangeUserInfoParams(body: any): asserts body is IChangeUserInfoBody {
    if (!body) throw new BizException('body is undefined');
    const { account, play_time, user_name, wechat_name } = body as IChangeUserInfoBody;

    if (!account) throw new BizException('body.account is error');
    if (!play_time) throw new BizException('body.play_time is error');
    if (!user_name) throw new BizException('body.user_name is error');
    if (!wechat_name) throw new BizException('body.wechat_name is error');
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

  static async changePassword(ctx: Context) {
    try {
      UserController.validateChangePasswordParams(ctx.request.body);
      const { password } = ctx.request.body;
      const user = await UserService.changePassword(ctx.state.user.id, password);
      ctx.success(user);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }

  static async changeUserInfo(ctx: Context) {
    try {
      UserController.validateChangeUserInfoParams(ctx.request.body);
      const user = await UserService.changeUserInfo(ctx.state.user.id, ctx.request.body);
      ctx.success(user);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }

  static async allUsers(ctx: Context) {
    try {
      const user = await UserService.getAllUsers(ctx.state.user.id);
      ctx.success(user);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }
}

export default UserController;
