import { IRole } from '../models/Role';

interface Role extends Pick<IRole, 'role_name' | 'classes' | 'talent' | 'auto_signup'> {
  id: IRole['_id'];
}

export interface IBindRoleBody extends Pick<IRole, 'role_name' | 'classes' | 'talent'> {}
export interface IUnbindRoleBody extends Pick<IRole, 'id'> {}
export interface IUpdateRoleBody extends Role {}
export interface IUpdateRoleResponse extends Role {}
export interface IGetAllRoleResponse extends Array<Role> {}
