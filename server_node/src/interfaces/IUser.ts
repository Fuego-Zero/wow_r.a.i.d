import { IUser } from '../models/User';

export interface IChangePasswordBody extends Pick<IUser, 'password'> {}

// export interface ILoginResponse extends Pick<IUser, 'user_name' | 'wechat_name' | 'play_time'> {
//   token: string;
// }
