import { IWCLRankingsResponse } from '../interfaces/IWCLRankings';
import WCLRankings from '../models/WCLRankings';

class WCLRankingsService {
  static async getWCLRankings(): Promise<IWCLRankingsResponse> {
    const rankings = await WCLRankings.find({}).lean();

    return rankings.map((item) => ({
      role_name: item.role_name,
      talent: item.talent,
      average_rank_percent: item.average_rank_percent,
      server_rank: item.server_rank,
    }));
  }
}

export default WCLRankingsService;
