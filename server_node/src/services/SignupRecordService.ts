import { BizException } from '@yfsdk/web-basic-library';

import { IAddSignupRecordResponse, IAllSignupRecordResponse } from '../interfaces/ISignupRecord';
import Role from '../models/Role';
import SignupRecord from '../models/SignupRecord';
import User from '../models/User';
import { RoleId, SignupRecordId, UserId } from '../types';
import { getRaidDateRange } from '../utils';
import { validateUserAccess } from '../utils/user';
import ScheduleService from './ScheduleService';

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

  static async delRecord(userId: UserId, recordIds: SignupRecordId[]): Promise<boolean> {
    const date = getRaidDateRange();

    const findParams = {
      user_id: userId,
      _id: { $in: recordIds },
      delete_time: null,
      create_time: {
        $gte: date.startDate,
        $lte: date.endDate,
      },
    };

    // 检查是否已存在报名记录
    const existingRecords = await SignupRecord.find(findParams).lean();
    if (existingRecords.length !== recordIds.length) throw new BizException('部分报名记录不存在');

    // 批量修改多条记录
    const result = await SignupRecord.updateMany(findParams, { delete_time: new Date() });

    // 检查是否所有记录都已更新
    if (result.modifiedCount !== recordIds.length) throw new BizException('部分记录删除失败');

    //* 修改排班表中的记录，请假状态改为已请假
    const roleIds = existingRecords.map((r) => r.role_id);
    await ScheduleService.leave(userId, roleIds);

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

  static async batchAddRecords(userId: UserId): Promise<number> {
    await validateUserAccess(userId);

    //* 查询所有自动报名的角色
    const autoSignupRoles = await Role.find({ auto_signup: true }).lean();
    const autoSignupRoleIds = autoSignupRoles.map((role) => role._id);

    const { startDate, endDate } = getRaidDateRange();

    //* 批量查询所有已报名的角色
    const signupIds = (
      await SignupRecord.find({
        role_id: { $in: autoSignupRoleIds },
        delete_time: null,
        create_time: {
          $gte: startDate,
          $lte: endDate,
        },
      }).lean()
    ).map((record) => record.role_id.toString());

    //* 过滤掉已报名的角色
    const unassignedRoles = autoSignupRoles.filter((role) => !signupIds.includes(role._id.toString()));

    //* 所有需要报名的用户
    const unassignedUserIds = Array.from(
      unassignedRoles.reduce((acc, role) => {
        acc.add(role.user_id.toString());
        return acc;
      }, new Set()),
    );

    const unassignedUser = await User.find({ _id: { $in: unassignedUserIds } }).lean();
    const unassignedUserMap = unassignedUser.reduce((acc, user) => {
      acc.set(user._id.toString(), user);
      return acc;
    }, new Map());

    //* 创建批量报名记录，只保留有 play_time 的记录
    const recordsToCreate = unassignedRoles
      .map((role) => ({
        role_id: role._id,
        talent: role.talent,
        classes: role.classes,
        role_name: role.role_name,

        user_id: unassignedUserMap.get(role.user_id.toString())?._id,
        play_time: unassignedUserMap.get(role.user_id.toString())?.play_time,
        user_name: unassignedUserMap.get(role.user_id.toString())?.user_name,
      }))
      .filter((record) => record.play_time.length > 0);

    //* 批量创建记录
    const createdRecords = await SignupRecord.insertMany(recordsToCreate);

    return createdRecords.length;
  }

  /**
   * 内部方法，删除报名记录
   *
   * @param userId
   * @param roleIds
   * @returns
   */
  static async delRoleRecord(userId: UserId, roleIds: RoleId[]): Promise<boolean> {
    // 查询用户
    const user = await User.findById(userId).lean();
    if (!user) throw new BizException('用户不存在');

    const { startDate, endDate } = getRaidDateRange();

    // 检查是否已存在报名记录
    const existingRecords = await SignupRecord.find({
      user_id: userId,
      role_id: { $in: roleIds },
      delete_time: null,
      create_time: {
        $gte: startDate,
        $lte: endDate,
      },
    }).lean();

    if (existingRecords.length === 0) return true;
    const existingIds = existingRecords.map((r) => r._id.toString());

    // 批量修改多条记录
    const result = await SignupRecord.updateMany({ _id: { $in: existingIds } }, { delete_time: new Date() });

    // 检查是否所有记录都已更新
    if (result.modifiedCount !== existingIds.length) throw new BizException('部分记录删除失败');

    return true;
  }

  static async recreateRecord(userId: UserId, roleIds: RoleId[]): Promise<boolean> {
    await SignupRecordService.delRoleRecord(userId, roleIds);
    await SignupRecordService.addRecord(userId, roleIds);
    return true;
  }
}

export default SignupRecordService;
