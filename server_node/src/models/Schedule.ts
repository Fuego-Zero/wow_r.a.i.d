import mongoose, { Document, Schema } from 'mongoose';

import { RoleClassesMap, TalentMap } from '../common';
import { RoleId, ScheduleId, UserId } from '../types';
import RaidTime from './RaidTime';

export interface ISchedule extends Document<ScheduleId> {
  /**
   * 角色ID
   */
  role_id: RoleId;
  /**
   * 角色天赋
   */
  talent: TalentMap[];
  /**
   * 角色职业
   */
  classes: RoleClassesMap;
  /**
   * 角色名
   */
  role_name: string;

  /**
   * 用户ID
   */
  user_id: UserId;
  /**
   * 游戏时间
   */
  play_time: string[];
  /**
   * 用户名
   */
  user_name: string;

  /**
   * 安排的参团时间的key
   */
  group_time_key: string;
  /**
   * 安排的参团时间的排序
   */
  group_time_order: number;
  /**
   * 参加的团队标题
   */
  group_title: string;

  /**
   * 是否发布
   */
  is_publish: boolean;

  /**
   * 创建时间
   */
  create_time: Date;
}

const schema = new Schema<ISchedule>(
  {
    role_id: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    role_name: {
      type: String,
      required: true,
    },
    classes: {
      type: String,
      required: true,
      enum: RoleClassesMap,
    },
    talent: {
      type: [
        {
          type: String,
          required: true,
          enum: TalentMap,
        },
      ],
    },

    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    play_time: [String],

    group_time_key: {
      type: String,
      required: true,
      index: true,
      validate: {
        async validator(v: string) {
          const raidTime = await RaidTime.findOne({ time_key: v }).lean();
          return !!raidTime;
        },
        message: (props) => `${props.value} 不是有效的 time_key!`,
      },
    },
    group_time_order: Number,
    group_title: String,

    is_publish: {
      type: Boolean,
      default: false,
    },

    create_time: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

const Schedule = mongoose.model<ISchedule>('Schedule', schema, 'schedule');

export default Schedule;
