import { IRole } from '../models/Role';

export interface IBindRoleBody extends Pick<IRole, 'role_name' | 'classes' | 'talent'> {}
export interface IUnbindRoleBody extends Pick<IRole, 'id'> {}
