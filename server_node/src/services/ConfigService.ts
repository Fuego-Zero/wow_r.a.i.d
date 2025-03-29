import { IRaidTimeResponse } from '../interfaces/IRaidTime';
import GroupInfo from '../models/GroupInfo';
import RaidTime from '../models/RaidTime';

class ConfigService {
  static async initRaidTime(): Promise<void> {
    const date = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const sub = ['一', '二', '三'];
    const data = [4, 5, 6, 7, 1, 2, 3].map((_dateIndex, dateIdx) =>
      sub.map((_sub, index) => ({
        time_name: `${date[_dateIndex - 1]} (第${_sub}车)`,
        time_key: `${_dateIndex}-${index + 1}`,
        order: dateIdx * sub.length + index,
      })),
    );

    await RaidTime.deleteMany({});
    await RaidTime.insertMany(data.flat());
  }

  static async initGroupInfo(): Promise<void> {
    const titleMap = {
      '4-1': '周四 - 19:30',
      '4-2': '周四 - 20:30',
      '4-3': '周四 - 21:30',
      '5-1': '周五 - 19:30',
      '5-2': '周五 - 20:30',
      '5-3': '周五 - 21:30',
      '6-1': '周六 - 19:30',
      '6-2': '周六 - 20:30',
      '6-3': '周六 - 21:30',
      '7-1': '周日 - 19:30',
      '7-2': '周日 - 20:30',
      '7-3': '周日 - 21:30',
      '1-1': '周一 - 19:30',
      '1-2': '周一 - 20:30',
      '1-3': '周一 - 21:30',
      '2-1': '周二 - 19:30',
      '2-2': '周二 - 20:30',
      '2-3': '周二 - 21:30',
      '3-1': '周三 - 19:30',
      '3-2': '周三 - 20:30',
      '3-3': '周三 - 21:30',
    };

    const data = Object.entries(titleMap).map(([time_key, title]) => ({
      time_key,
      title,
    }));

    await GroupInfo.deleteMany({});
    await GroupInfo.insertMany(data);
  }

  static async getRaidTime(): Promise<IRaidTimeResponse> {
    const raidTimes = await RaidTime.find({}).sort({ order: 1 }).lean();

    return raidTimes.map((item) => ({
      time_name: item.time_name,
      time_key: item.time_key,
      order: item.order,
    }));
  }
}

// ConfigService.initRaidTime();
// ConfigService.initGroupInfo();

export default ConfigService;
