import { BizException } from '@yfsdk/web-basic-library';

import { IAddSignupRecordResponse } from '../interfaces/ISignupRecord';
import Role from '../models/Role';
import SignupRecord from '../models/SignupRecord';
import User from '../models/User';
import { RoleId, UserId } from '../types';
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
      id: record.id,

      role_id: record.role_id,
      talent: record.talent,
      classes: record.classes,
      role_name: record.role_name,

      user_id: record.user_id,
      play_time: record.play_time,
      user_name: record.user_name,
    };
  }
}

export default SignupRecordService;
