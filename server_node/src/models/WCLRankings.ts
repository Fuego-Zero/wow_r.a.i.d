import mongoose, { Document, Schema } from 'mongoose';

import { TalentMap } from '../common';

export interface IWCLRankings extends Document {
  /**
   * 角色名称
   */
  role_name: string;
  /**
   * 角色天赋
   */
  talent: TalentMap[];
  /**
   * 服务器ID
   */
  zone_id: number;
  /**
   * 全明星分
   */
  average_rank_percent: number;
  /**
   * 服务器排名
   */
  server_rank: number;
  /**
   * 创建时间
   */
  create_time: Date;
  /**
   * 更新时间
   */
  update_time: Date;
}

const schema = new Schema<IWCLRankings>(
  {
    role_name: {
      type: String,
      required: true,
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
    zone_id: Number,
    average_rank_percent: Number,
    server_rank: Number,
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

const WCLRankings = mongoose.model<IWCLRankings>('WCLRankings', schema, 'wcl_rankings');

export default WCLRankings;
