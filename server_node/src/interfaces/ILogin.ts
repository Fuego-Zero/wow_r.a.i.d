import { IUser } from '../models/User';

export interface ILoginBody extends Pick<IUser, 'account' | 'password'> {}

export interface ILoginResponse extends Pick<IUser, 'user_name' | 'wechat_name' | 'play_time' | 'account'> {
  token: string;
}
