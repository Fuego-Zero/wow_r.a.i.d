import { BizException } from '@yfsdk/web-basic-library';

import { AssignmentMap } from '../common';
import { IGetScheduleResponse, ISaveScheduleBody } from '../interfaces/ISchedule';
import GroupInfo, { IGroupInfo } from '../models/GroupInfo';
import RaidTime, { IRaidTime } from '../models/RaidTime';
import Role from '../models/Role';
import Schedule from '../models/Schedule';
import SignupRecord from '../models/SignupRecord';
import { RoleId, UserId } from '../types';
import { getRaidDateRange } from '../utils';
import { validateUserAccess } from '../utils/user';

class ScheduleService {
  static async getSchedule(userId: UserId): Promise<IGetScheduleResponse> {
    await validateUserAccess(userId);

    const { startDate, endDate } = getRaidDateRange();

    const scheduleResponse: IGetScheduleResponse = [];

    const players = await Schedule.find({
      create_time: {
        $gte: startDate,
        $lte: endDate,
      },
    }).lean();

    const scheduledRoleIds = new Set(players.map((player) => player.role_id.toString()));

    const records = await SignupRecord.find({
      delete_time: null,
      create_time: {
        $gte: startDate,
        $lte: endDate,
      },
      role_id: { $nin: Array.from(scheduledRoleIds) },
    }).lean();

    const disableRoles = await Role.find({ disable_schedule: true }).lean();
    const disableRoleIds = new Set(disableRoles.map((role) => role._id.toString()));

    players.forEach((player) => {
      scheduleResponse.push({
        role_id: player.role_id,
        talent: player.talent,
        classes: player.classes,
        role_name: player.role_name,

        user_id: player.user_id,
        play_time: player.play_time,
        user_name: player.user_name,

        is_scheduled: true,
        assignment: player.assignment,

        group_time_key: player.group_time_key,
        group_time_order: player.group_time_order,
        group_title: player.group_title,
      });
    });

    records.forEach((record) => {
      scheduleResponse.push({
        role_id: record.role_id,
        talent: record.talent,
        classes: record.classes,
        role_name: record.role_name,

        user_id: record.user_id,
        play_time: record.play_time,
        user_name: record.user_name,

        is_scheduled: false,
        assignment: AssignmentMap.DPS, //* 默认职责全部是DPS

        group_time_key: '',
        group_time_order: -1,
        group_title: '',
      });
    });

    return scheduleResponse.filter((item) => !disableRoleIds.has(item.role_id.toString()));
  }

  static async saveSchedule(userId: UserId, body: ISaveScheduleBody): Promise<boolean> {
    await validateUserAccess(userId);

    //* 获取当前CD时间范围
    const { startDate, endDate } = getRaidDateRange();

    //* 先验证所有要添加的记录是否存在于报名表中
    const recordIds = body.map((record) => record.role_id);
    const existingRecords = await SignupRecord.find({
      role_id: { $in: recordIds },
      create_time: {
        $gte: startDate,
        $lte: endDate,
      },
      delete_time: null,
    }).lean();
    if (existingRecords.length !== recordIds.length) {
      const missingRecordIds = recordIds.filter(
        (recordId) => !existingRecords.some((record) => record.role_id.toString() === recordId.toString()),
      );

      throw new BizException(
        `部分报名记录不存在，角色数（${recordIds.length}），报名数（${existingRecords.length}），缺失角色ID（${missingRecordIds.join(',')}）`,
      );
    }

    //* 删除时间范围内的所有安排数据
    await Schedule.deleteMany({ create_time: { $gte: startDate, $lte: endDate } });

    const groupInfoMap = (
      await GroupInfo.find()
        .populate({
          path: 'time_key',
          model: RaidTime,
          localField: 'time_key',
          foreignField: 'time_key',
          select: 'order',
        })
        .lean()
    ).reduce(
      (prev, item) => {
        const timeKey = item.time_key as unknown as IRaidTime;
        prev[timeKey.time_key] = { order: timeKey.order, title: item.title };
        return prev;
      },
      {} as Record<string, Pick<IRaidTime, 'order'> & Pick<IGroupInfo, 'title'>>,
    );

    // TODO 该处理论上需要验证所有排班记录是否和报名表匹配，暂时不写

    //* 准备要添加的数据
    const scheduleItems = body.map((item) => ({
      role_id: item.role_id,
      talent: item.talent,
      classes: item.classes,
      role_name: item.role_name,
      user_id: item.user_id,
      play_time: item.play_time,
      user_name: item.user_name,
      group_time_key: item.group_time_key,
      group_time_order: groupInfoMap[item.group_time_key].order,
      group_title: groupInfoMap[item.group_time_key].title,
      assignment: item.assignment,
      create_time: new Date(),
    }));

    //* 批量添加新数据
    if (scheduleItems.length > 0) await Schedule.insertMany(scheduleItems);

    return true;
  }

  static async getPublished(): Promise<IGetScheduleResponse> {
    const { startDate, endDate } = getRaidDateRange();

    const players = await Schedule.find({
      is_publish: true,
      create_time: {
        $gte: startDate,
        $lte: endDate,
      },
    }).lean();

    return players.map((player) => ({
      role_id: player.role_id,
      talent: player.talent,
      classes: player.classes,
      role_name: player.role_name,

      user_id: player.user_id,
      play_time: player.play_time,
      user_name: player.user_name,

      is_scheduled: true,
      assignment: player.assignment,

      group_time_key: player.group_time_key,
      group_time_order: player.group_time_order,
      group_title: player.group_title,
    }));
  }

  static async publish(userId: UserId): Promise<boolean> {
    await validateUserAccess(userId);

    const { startDate, endDate } = getRaidDateRange();

    await Schedule.updateMany(
      {
        create_time: {
          $gte: startDate,
          $lte: endDate,
        },
      },
      { is_publish: true },
    );

    return true;
  }

  static async unpublish(userId: UserId): Promise<boolean> {
    await validateUserAccess(userId);

    const { startDate, endDate } = getRaidDateRange();

    await Schedule.updateMany(
      {
        create_time: {
          $gte: startDate,
          $lte: endDate,
        },
      },
      { is_publish: false },
    );

    return true;
  }

  static async delSchedule(userId: UserId, roleId: RoleId): Promise<boolean> {
    const { startDate, endDate } = getRaidDateRange();

    const schedule = await Schedule.findOne({
      role_id: roleId,
      create_time: {
        $gte: startDate,
        $lte: endDate,
      },
    }).lean();

    if (!schedule) return true;
    if (schedule?.user_id.toString() !== userId.toString()) throw new BizException('角色不存在或不属于当前用户');

    await Schedule.deleteOne({ _id: schedule._id });

    return true;
  }

  static async delSchedules(userId: UserId, roleIds: RoleId[]): Promise<boolean> {
    const { startDate, endDate } = getRaidDateRange();

    //* 查询所有符合条件的排班记录
    const schedule = await Schedule.find({
      user_id: userId,
      role_id: {
        $in: roleIds,
      },
      create_time: {
        $gte: startDate,
        $lte: endDate,
      },
    }).lean();

    if (schedule.length === 0) return true;

    //* 遍历删除所有记录
    await Schedule.deleteMany({
      user_id: userId,
      role_id: {
        $in: roleIds,
      },
      create_time: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    return true;
  }
}

export default ScheduleService;
