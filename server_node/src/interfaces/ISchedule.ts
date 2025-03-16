import { ISchedule } from '../models/Schedule';

interface SchedulePlayer
  extends Pick<
    ISchedule,
    | 'role_id'
    | 'talent'
    | 'classes'
    | 'role_name'
    | 'user_id'
    | 'play_time'
    | 'user_name'
    | 'group_time_key'
    | 'group_time_order'
    | 'group_title'
  > {
  is_scheduled: boolean;
}

export interface IGetScheduleResponse extends Array<SchedulePlayer> {}
