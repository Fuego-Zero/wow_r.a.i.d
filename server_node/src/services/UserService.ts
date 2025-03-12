import { BizException } from '@yfsdk/web-basic-library';
import jwt from 'jsonwebtoken';

import { secretKey } from '../config';
import { ILoginBody, ILoginResponse } from '../interfaces/ILogin';
import User, { IUser } from '../models/User';
import { UserId } from '../types';

class UserService {
  static async findUser(id: UserId): Promise<Pick<IUser, 'wechat_name' | 'play_time' | 'user_name'>> {
    const user = await User.findById(id).lean();
    if (!user) throw new BizException('用户不存在');

    const { wechat_name, play_time, user_name } = user;
    return { wechat_name, play_time, user_name };
  }

  static async login(body: ILoginBody): Promise<ILoginResponse> {
    const user = await User.findOne({ account: body.account });
    if (!user) throw new BizException('用户不存在');
    if (user.password !== body.password) throw new BizException('用户密码错误');

    const { user_name, wechat_name, play_time, id } = user;
    const token = jwt.sign({ id }, secretKey, { expiresIn: '1h' });
    return { token, user_name, wechat_name, play_time };
  }
}

export default UserService;
