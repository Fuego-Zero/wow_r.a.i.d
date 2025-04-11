import { IRole } from '../models/Role';
import { IUser } from '../models/User';
import { IWCLRankings } from '../models/WCLRankings';

type WCL = Pick<IWCLRankings, 'role_name' | 'talent' | 'average_rank_percent' | 'server_rank'>;
type Role = Pick<IRole, 'classes'>;
type User = Pick<IUser, 'user_name'>;

export interface IWCLRankingsResponse extends Array<WCL & Role & User> {}
