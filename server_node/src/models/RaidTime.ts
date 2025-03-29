import mongoose, { Document, Schema } from 'mongoose';

export interface IRaidTime extends Document {
  /**
   * 团本时间中文名
   */
  time_name: string;
  /**
   * 团本时间
   */
  time_key: string;
  /**
   * 排序
   */
  order: number;
  /**
   * 创建时间
   */
  create_time: Date;
  /**
   * 更新时间
   */
  update_time: Date;
}

const schema = new Schema<IRaidTime>(
  {
    time_name: {
      type: String,
      required: true,
    },
    time_key: {
      type: String,
      required: true,
      unique: true,
    },
    order: {
      type: Number,
      required: true,
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

const RaidTime = mongoose.model<IRaidTime>('RaidTime', schema, 'raid_time');

export default RaidTime;
