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
   * 创建时间
   */
  create_time: Date;
  /**
   * 更新时间
   */
  update_time: Date;
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
    wechat_name: String,
    play_time: [String],
    create_time: {
      type: Date,
      default: Date.now,
    },
    update_time: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

const User = mongoose.model<IUser>('User', schema, 'user');

export default User;
