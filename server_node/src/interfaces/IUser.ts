import { IUser } from '../models/User';

interface User extends Pick<IUser, 'wechat_name' | 'play_time' | 'user_name' | 'account'> {}

export interface IChangePasswordBody extends Pick<IUser, 'password'> {}
export interface IChangeUserinfoBody extends User {}
export interface IChangeUserinfoResponse extends User {}
