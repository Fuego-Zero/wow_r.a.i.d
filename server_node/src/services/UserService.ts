import { BizException, InferArrayItem } from '@yfsdk/web-basic-library';
import bcrypt from 'bcrypt'; // eslint-disable-line
import jwt from 'jsonwebtoken';

import { secretKey } from '../config';
import { ILoginBody, ILoginResponse } from '../interfaces/ILogin';
import { IAllUsersResponse, IChangeUserInfoBody, IChangeUserInfoResponse } from '../interfaces/IUser';
import Role from '../models/Role';
import SignupRecord from '../models/SignupRecord';
import User from '../models/User';
import { UserId } from '../types';
import { getRaidDateRange } from '../utils';
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

    const date = getRaidDateRange();
    const users = await User.find({}).lean();
    const roles = await Role.find({}, { user_id: 1, role_name: 1, classes: 1, talent: 1, disable_schedule: 1 }).lean();
    const records = await SignupRecord.find(
      {
        delete_time: null,
        create_time: { $gte: date.startDate, $lte: date.endDate },
      },
      { role_id: 1 },
    ).lean();

    const recordsSet = new Set(records.map((record) => record.role_id.toString()));
    const rolesMap = roles.reduce(
      (acc, role) => {
        const key = role.user_id.toString();
        acc[key] ??= [];
        acc[key].push({
          id: role._id,
          role_name: role.role_name,
          classes: role.classes,
          talent: role.talent,
          disable_schedule: role.disable_schedule,
          is_signup: recordsSet.has(String(role._id)),
        });
        return acc;
      },
      {} as Record<string, InferArrayItem<IAllUsersResponse>['roles']>,
    );

    return users.map((user) => ({
      id: user._id,
      account: user.account,
      play_time: user.play_time,
      user_name: user.user_name,
      wechat_name: user.wechat_name,
      is_admin: user.is_admin,
      roles: rolesMap[user._id.toString()] ?? [],
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
