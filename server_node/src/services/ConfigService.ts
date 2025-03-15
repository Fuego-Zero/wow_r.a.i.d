import { IRaidTimeResponse } from '../interfaces/IRaidTime';
import RaidTime from '../models/RaidTime';

const { NODE_ENV } = process.env;

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

  static async getRaidTime(): Promise<IRaidTimeResponse> {
    const raidTimes = await RaidTime.find({}).sort({ order: 1 }).lean();

    return raidTimes.map((item) => ({
      time_name: item.time_name,
      time_key: item.time_key,
    }));
  }
}

if (NODE_ENV === 'development') ConfigService.initRaidTime();

export default ConfigService;
