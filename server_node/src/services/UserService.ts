import { BizException } from '@yfsdk/web-basic-library';
import bcrypt from 'bcrypt'; // eslint-disable-line
import jwt from 'jsonwebtoken';

import { secretKey } from '../config';
import { ILoginBody, ILoginResponse } from '../interfaces/ILogin';
import { IAllUsersResponse, IChangeUserInfoBody, IChangeUserInfoResponse } from '../interfaces/IUser';
import User from '../models/User';
import { UserId } from '../types';
import { validateUserAccess } from '../utils/user';

class UserService {
  static async findUser(id: UserId): Promise<Omit<ILoginResponse, 'token'>> {
    const user = await User.findById(id).lean();
    if (!user) throw new BizException('用户不存在');

    const { wechat_name, play_time, user_name, account, is_admin } = user;
    return { wechat_name, play_time, user_name, account, is_admin };
  }

  static async login(body: ILoginBody): Promise<ILoginResponse> {
    const user = await User.findOne({ account: body.account });
    if (!user) throw new BizException('用户不存在');

    const isValid = await bcrypt.compare(body.password, user.password);
    if (!isValid) throw new BizException('用户密码错误');

    const { user_name, wechat_name, play_time, id, account } = user;
    const token = jwt.sign({ id }, secretKey, { expiresIn: '12h' });
    return { token, user_name, wechat_name, play_time, account, is_admin: user.is_admin };
  }

  static async changePassword(userId: UserId, password: string): Promise<boolean> {
    const user = await User.findOne({ _id: userId });
    if (!user) throw new BizException('用户不存在');

    const salt = await bcrypt.genSalt(12);
    password = await bcrypt.hash(password, salt);

    await User.updateOne({ _id: userId }, { password, update_time: Date.now() });
    return true;
  }

  static async changeUserInfo(userId: UserId, body: IChangeUserInfoBody): Promise<IChangeUserInfoResponse> {
    const user = await User.findOne({ _id: userId });
    if (!user) throw new BizException('用户不存在');

    const { wechat_name, user_name, account, play_time } = body;

    let foundUser = await User.findOne({ account });
    if (foundUser && user.id !== foundUser.id) throw new BizException('账号已存在');

    if (foundUser && user.id !== foundUser.id) throw new BizException('用户名已存在');

    foundUser = await User.findOne({ wechat_name });
    if (foundUser && user.id !== foundUser.id) throw new BizException('微信名已存在');

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        wechat_name,
        user_name,
        account,
        play_time,
        update_time: new Date(),
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser) throw new BizException('更新用户信息失败');

    return {
      account: updatedUser.account,
      play_time: updatedUser.play_time,
      user_name: updatedUser.user_name,
      wechat_name: updatedUser.wechat_name,
      is_admin: updatedUser.is_admin,
    };
  }

  static async getAllUsers(userId: UserId): Promise<IAllUsersResponse> {
    await validateUserAccess(userId);

    const users = await User.find({}).lean();

    return users.map((u) => ({
      id: u._id,
      account: u.account,
      play_time: u.play_time,
      user_name: u.user_name,
      wechat_name: u.wechat_name,
      is_admin: u.is_admin,
    }));
  }

  static async resetPassword(userId: UserId, targetUserId: UserId, password: string): Promise<boolean> {
    await validateUserAccess(userId);

    const targetUser = await User.findOne({ _id: targetUserId });
    if (!targetUser) throw new BizException('目标用户不存在');

    const salt = await bcrypt.genSalt(12);
    password = await bcrypt.hash(password, salt);

    await User.updateOne({ _id: targetUserId }, { password, update_time: Date.now() });
    return true;
  }
}

export default UserService;
