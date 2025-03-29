import { IGetGroupInfoResponse, ISaveGroupInfoBody } from '../interfaces/IGroupInfo';
import GroupInfo from '../models/GroupInfo';
import RaidTime from '../models/RaidTime';
import { UserId } from '../types';
import { validateUserAccess } from '../utils/user';
import ScheduleService from './ScheduleService';

class GroupInfoService {
  static async getGroupInfo(userId: UserId): Promise<IGetGroupInfoResponse> {
    await validateUserAccess(userId);

    const groupInfos = await GroupInfo.find({}, { _id: 0, create_time: 0, update_time: 0 }).lean();
    const raidTimes = await RaidTime.find({}, { _id: 0, order: 1, time_key: 1 }).lean();

    groupInfos.sort((a, b) => {
      const aTime = raidTimes.find((item) => item.time_key === a.time_key)?.order ?? 0;
      const bTime = raidTimes.find((item) => item.time_key === b.time_key)?.order ?? 0;
      return aTime - bTime;
    });

    return groupInfos;
  }

  static async saveGroupInfo(userId: UserId, body: ISaveGroupInfoBody): Promise<boolean> {
    await validateUserAccess(userId);

    const groupInfos = await GroupInfo.find({}, { _id: 0, title: 1, time_key: 1 }).lean();

    const insertData = body.map((item) => {
      const groupInfo = groupInfos.find((group) => group.time_key === item.time_key);
      return {
        title: groupInfo!.title,
        ...item,
      };
    });

    await GroupInfo.deleteMany({});
    await GroupInfo.insertMany(insertData);

    //* 删除所有无效的报名信息
    const deleteTimeKeys = body.filter((item) => !item.enable).map((item) => item.time_key);
    await ScheduleService.delSchedulesByTimeKey(userId, deleteTimeKeys);

    return true;
  }
}

export default GroupInfoService;
