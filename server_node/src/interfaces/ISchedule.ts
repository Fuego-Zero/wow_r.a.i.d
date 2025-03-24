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
  /**
   * 是否已安排
   *
   * @description 因为排班表返回的数据包含了未安排的角色，所以前端需要根据这个字段来判断是否已安排
   */
  is_scheduled: boolean;
}

export interface IGetScheduleResponse extends Array<SchedulePlayer> {}

export interface ISaveScheduleBody
  extends Array<Omit<SchedulePlayer, 'is_scheduled' | 'group_time_order' | 'group_title'>> {}
