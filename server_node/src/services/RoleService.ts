import { BizException } from '@yfsdk/web-basic-library';

import { IBindRoleBody } from '../interfaces/IRole';
import Role from '../models/Role';
import { RoleId, UserId } from '../types';

class RoleService {
  // static async findRole(name: string): Promise<IRole | null> {
  //   const role = await Role.find({ role_name: name }).lean();

  //   return role;
  // }

  static async bindRole(id: UserId, body: IBindRoleBody): Promise<boolean> {
    const { role_name } = body;
    const role = await Role.find({ role_name }).lean();
    if (role.length > 0) throw new BizException('角色已绑定');

    await Role.create({ user_id: id, ...body });
    return true;
  }

  static async unbindRole(id: UserId, roleId: RoleId): Promise<boolean> {
    const role = await Role.findOne({ _id: roleId, user_id: id });
    if (!role) throw new BizException('角色不存在或不属于当前用户');

    const result = await Role.deleteOne({ _id: roleId, user_id: id });
    if (result.deletedCount === 0) throw new BizException('删除角色失败');

    return true;
  }
}

export default RoleService;
