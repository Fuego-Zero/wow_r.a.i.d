import { BizException } from '@yfsdk/web-basic-library';

import { IBindRoleBody, IGetAllRoleResponse, IUpdateRoleBody, IUpdateRoleResponse } from '../interfaces/IRole';
import Role from '../models/Role';
import { RoleId, UserId } from '../types';
import ScheduleService from './ScheduleService';
import SignupRecordService from './SignupRecordService';

class RoleService {
  static async bindRole(userId: UserId, body: IBindRoleBody): Promise<boolean> {
    const { role_name } = body;
    const role = await Role.find({ role_name }).lean();
    if (role.length > 0) throw new BizException('角色已绑定');

    await Role.create({ user_id: userId, ...body });
    return true;
  }

  static async unbindRole(userId: UserId, roleId: RoleId): Promise<boolean> {
    const role = await Role.findOne({ _id: roleId, user_id: userId });
    if (!role) throw new BizException('角色不存在或不属于当前用户');

    const result = await Role.deleteOne({ _id: roleId, user_id: userId });
    if (result.deletedCount === 0) throw new BizException('删除角色失败');

    await SignupRecordService.delRoleRecord(userId, [roleId]);
    await ScheduleService.delSchedule(userId, roleId);

    return true;
  }

  static async updateRole(userId: UserId, body: IUpdateRoleBody): Promise<IUpdateRoleResponse> {
    const { id: roleId, role_name, ...updateData } = body;

    let role = await Role.findOne({ _id: roleId, user_id: userId });
    if (!role) throw new BizException('角色不存在或不属于当前用户');

    role = await Role.findOne({ role_name });
    if (role?.user_id.toString() !== userId.toString()) throw new BizException('新名称已存在');

    const updatedRole = await Role.findOneAndUpdate(
      { _id: roleId, user_id: userId },
      {
        ...updateData,
        role_name,
        update_time: new Date(),
      },
      { new: true, runValidators: true },
    );

    if (!updatedRole) throw new BizException('更新角色失败');

    return {
      classes: updatedRole.classes,
      role_name: updatedRole.role_name,
      talent: updatedRole.talent,
      id: updatedRole.id,
      auto_signup: updatedRole.auto_signup,
    };
  }

  static async getAllRole(userId: UserId): Promise<IGetAllRoleResponse> {
    const roles = await Role.find({ user_id: userId }).lean();

    return roles.map((role) => {
      const { role_name, talent, classes, user_id, _id, auto_signup } = role;
      return { role_name, talent, classes, user_id, id: _id, auto_signup };
    });
  }
}

export default RoleService;
