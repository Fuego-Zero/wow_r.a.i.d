import mongoose, { Document, Schema } from 'mongoose';

import RaidTime from './RaidTime';

export interface IGroupInfo extends Document {
  /**
   * 团队活动时间的key，关联到 RaidTime 中的 time_key
   */
  time_key: string;
  /**
   * 团队标题
   */
  title: string;
  /**
   * 是否启用
   */
  enable?: boolean;
  /**
   * 是否自动编排
   */
  auto?: boolean;
  /**
   * 创建时间
   */
  create_time: Date;
  /**
   * 更新时间
   */
  update_time: Date;
}

const schema = new Schema<IGroupInfo>(
  {
    time_key: {
      type: String,
      required: true,
      ref: 'RaidTime',
      validate: {
        async validator(v: string) {
          const raidTime = await RaidTime.findOne({ time_key: v }).lean();
          return !!raidTime;
        },
        message: (props) => `${props.value} 不是有效的 time_key!`,
      },
    },
    title: {
      type: String,
      required: true,
    },
    enable: {
      type: Boolean,
      default: true,
    },
    auto: {
      type: Boolean,
      default: true,
    },
    create_time: {
      type: Date,
      default: Date.now,
    },
    update_time: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

const GroupInfo = mongoose.model<IGroupInfo>('groupInfo', schema, 'group_info');

export default GroupInfo;
