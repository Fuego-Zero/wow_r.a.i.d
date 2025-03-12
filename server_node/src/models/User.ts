import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
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

const schema = new Schema<IUser>({
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
  update_time: Date,
});

const User = mongoose.model<IUser>('User', schema, 'user');

export default User;
