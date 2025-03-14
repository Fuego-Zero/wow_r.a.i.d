import { BizException } from '@yfsdk/web-basic-library';

import { IAddSignupRecordResponse, IAllSignupRecordResponse } from '../interfaces/ISignupRecord';
import Role from '../models/Role';
import SignupRecord from '../models/SignupRecord';
import User from '../models/User';
import { RoleId, SignupRecordId, UserId } from '../types';
import { getRaidDateRange } from '../utils';

class SignupRecordService {
  static async addRecord(userId: UserId, roleIds: RoleId[]): Promise<IAddSignupRecordResponse> {
    // 查询用户
    const user = await User.findById(userId).lean();
    if (!user) throw new BizException('用户不存在');

    // 批量查询所有指定的角色
    const roles = await Role.find({ _id: { $in: roleIds } }).lean();
    if (roles.length !== roleIds.length) throw new BizException('部分角色不存在');

    const date = getRaidDateRange();

    // 检查是否已存在报名记录
    const existingRecords = await SignupRecord.find({
      user_id: userId,
      role_id: { $in: roleIds },
      delete_time: null,
      create_time: {
        $gte: date.startDate,
        $lte: date.endDate,
      },
    }).lean();
    if (existingRecords.length > 0) {
      const existingRoleIds = existingRecords.map((r) => `${r.role_id.toString()}(${r.role_name.toString()})`);
      throw new BizException(`角色 ${existingRoleIds.join(', ')} 本周已报名`);
    }

    // 创建批量报名记录
    const recordsToCreate = roles.map((role) => ({
      role_id: role._id,
      talent: role.talent,
      classes: role.classes,
      role_name: role.role_name,

      user_id: userId,
      play_time: user.play_time,
      user_name: user.user_name,
    }));

    // 批量创建记录
    const createdRecords = await SignupRecord.insertMany(recordsToCreate);

    // 返回创建的记录
    return createdRecords.map((record) => ({
      id: record._id,

      role_id: record.role_id,
      talent: record.talent,
      classes: record.classes,
      role_name: record.role_name,

      user_id: record.user_id,
      play_time: record.play_time,
      user_name: record.user_name,
    }));
  }

  static async delRecord(recordIds: SignupRecordId[]): Promise<boolean> {
    // 检查是否已存在报名记录
    const existingRecords = await SignupRecord.find({
      _id: { $in: recordIds },
      delete_time: null,
    }).lean();
    if (existingRecords.length !== recordIds.length) throw new BizException('部分报名记录不存在');

    // 批量修改多条记录
    const result = await SignupRecord.updateMany({ _id: { $in: recordIds } }, { delete_time: new Date() });

    // 检查是否所有记录都已更新
    if (result.modifiedCount !== recordIds.length) throw new BizException('部分记录删除失败');

    return true;
  }

  static async getAllRecord(userId: UserId): Promise<IAllSignupRecordResponse> {
    const user = await User.findById(userId).lean();
    if (!user) throw new BizException('用户不存在');

    const date = getRaidDateRange();
    const records = await SignupRecord.find({
      user_id: userId,
      delete_time: null,
      create_time: {
        $gte: date.startDate,
        $lte: date.endDate,
      },
    }).lean();

    return records.map((record) => ({
      id: record._id,

      role_id: record.role_id,
      talent: record.talent,
      classes: record.classes,
      role_name: record.role_name,

      user_id: record.user_id,
      play_time: record.play_time,
      user_name: record.user_name,
    }));
  }
}

export default SignupRecordService;
