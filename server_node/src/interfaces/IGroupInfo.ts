import { IGroupInfo } from '../models/GroupInfo';

export interface IGetGroupInfoResponse extends Array<Pick<IGroupInfo, 'time_key' | 'title' | 'enable' | 'auto'>> {}

export interface ISaveGroupInfoBody extends Array<Pick<IGroupInfo, 'time_key' | 'enable' | 'auto'>> {}
