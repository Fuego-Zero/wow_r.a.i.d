import { IWCLRankings } from '../models/WCLRankings';

export interface IWCLRankingsResponse
  extends Array<Pick<IWCLRankings, 'role_name' | 'talent' | 'average_rank_percent' | 'server_rank'>> {}
