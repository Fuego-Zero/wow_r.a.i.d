import { RoleClassesMap } from '../common';
import { IWCLRankingsResponse } from '../interfaces/IWCLRankings';
import Role from '../models/Role';
import User from '../models/User';
import WCLRankings from '../models/WCLRankings';

class WCLRankingsService {
  static async getWCLRankings(): Promise<IWCLRankingsResponse> {
    const rankings = await WCLRankings.find({}).lean();

    const roles = await Role.find({}).lean();
    const rolesMap = roles.reduce(
      (acc, role) => {
        const { user_id, role_name, classes } = role;

        acc[role_name] = {
          user_id: user_id.toString(),
          classes,
        };

        return acc;
      },
      {} as Record<string, { user_id: string; classes: RoleClassesMap }>,
    );

    const users = await User.find({}).lean();
    const usersMap = users.reduce(
      (acc, user) => {
        const { _id, user_name } = user;
        acc[_id.toString()] = user_name;
        return acc;
      },
      {} as Record<string, string>,
    );

    return rankings.map((item) => ({
      role_name: item.role_name,
      talent: item.talent,
      average_rank_percent: item.average_rank_percent,
      server_rank: item.server_rank,
      classes: rolesMap[item.role_name]?.classes,
      user_name: usersMap[rolesMap[item.role_name]?.user_id] ?? '',
    }));
  }
}

export default WCLRankingsService;
