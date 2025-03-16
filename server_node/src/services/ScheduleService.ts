import { IGetScheduleResponse } from '../interfaces/ISchedule';
import Schedule from '../models/Schedule';
import SignupRecord from '../models/SignupRecord';
import { UserId } from '../types';
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

    const records = await SignupRecord.find({
      delete_time: null,
      create_time: {
        $gte: startDate,
        $lte: endDate,
      },
    }).lean();

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

        group_time_key: '',
        group_time_order: -1,
        group_title: '',
      });
    });

    return scheduleResponse;
  }
}

export default ScheduleService;
