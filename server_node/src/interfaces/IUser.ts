import { IRole } from '../models/Role';
import { IUser } from '../models/User';

interface User extends Pick<IUser, 'wechat_name' | 'play_time' | 'user_name' | 'account' | 'is_admin'> {}
interface Role extends Pick<IRole, 'role_name' | 'classes' | 'talent' | 'disable_schedule'> {
  id: IRole['_id'];
  is_signup: boolean;
}

export interface IChangePasswordBody extends Pick<IUser, 'password'> {}
export interface IChangeUserInfoBody extends User {}
export interface IChangeUserInfoResponse extends User {}
export interface IAllUsersResponse extends Array<User & { id: IUser['_id']; roles: Array<Role> }> {}

export interface IResetPasswordBody extends Pick<IUser, 'password'> {
  targetUserId: IUser['_id'];
}
