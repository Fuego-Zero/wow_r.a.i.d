import mongoose, { Document, Schema } from 'mongoose';

import { UserId } from '../types';

export interface IUser extends Document<UserId> {
  /**
   * 账号
   */
  account: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 用户名
   */
  user_name: string;
  /**
   * 微信名
   */
  wechat_name: string;
  /**
   * 游戏时间
   */
  play_time: string[];
  /**
   * 是否是管理员
   */
  is_admin: boolean;
  /**
   * 创建时间
   */
  create_time: Date;
  /**
   * 更新时间
   */
  update_time: Date;
  /**
   * 最后登录时间
   *
   * @description 该字段在登录时更新
   */
  last_login_time: Date;
}

const schema = new Schema<IUser>(
  {
    account: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    wechat_name: {
      type: String,
      default: '',
    },
    play_time: [String],
    is_admin: {
      type: Boolean,
      default: false,
    },
    create_time: {
      type: Date,
      default: Date.now,
    },
    update_time: Date,
    last_login_time: Date,
  },
  {
    versionKey: false,
  },
);

const User = mongoose.model<IUser>('User', schema, 'user');

export default User;
