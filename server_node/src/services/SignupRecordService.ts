import { BizException } from '@yfsdk/web-basic-library';

import { IAddSignupRecordResponse, IAllSignupRecordResponse } from '../interfaces/ISignupRecord';
import Role from '../models/Role';
import SignupRecord from '../models/SignupRecord';
import User from '../models/User';
import { RoleId, SignupRecordId, UserId } from '../types';
import { getRaidDateRange } from '../utils';

class SignupRecordService {
  static async addRecord(userId: UserId, roleId: RoleId): Promise<IAddSignupRecordResponse> {
    const user = await User.findById(userId).lean();
    if (!user) throw new BizException('用户不存在');

    const role = await Role.findById(roleId).lean();
    if (!role) throw new BizException('角色不存在');

    const date = getRaidDateRange();

    let record = await SignupRecord.findOne({
      user_id: userId,
      role_id: roleId,
      delete_time: null,
      create_time: {
        $gte: date.startDate,
        $lte: date.endDate,
      },
    });
    if (record) throw new BizException('本周已报名');

    record = await SignupRecord.create({
      role_id: roleId,
      talent: role.talent,
      classes: role.classes,
      role_name: role.role_name,

      user_id: userId,
      play_time: user.play_time,
      user_name: user.user_name,
    });

    if (!record) throw new BizException('报名失败');

    return {
      id: record._id,

      role_id: record.role_id,
      talent: record.talent,
      classes: record.classes,
      role_name: record.role_name,

      user_id: record.user_id,
      play_time: record.play_time,
      user_name: record.user_name,
    };
  }

  static async delRecord(recordId: SignupRecordId): Promise<boolean> {
    let record = await SignupRecord.findById(recordId).lean();
    if (!record) throw new BizException('报名记录不存在');

    record = await SignupRecord.findOneAndUpdate({ _id: recordId }, { delete_time: new Date() });
    if (!record) throw new BizException('删除失败');

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
