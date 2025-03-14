import mongoose, { Document, Schema } from 'mongoose';

import { RoleClassesMap, TalentMap } from '../common';
import { RoleId, UserId } from '../types';

export interface IRole extends Document<RoleId> {
  user_id: UserId;
  /**
   * 角色名
   */
  role_name: string;
  /**
   * 角色职业
   */
  classes: RoleClassesMap;
  /**
   * 角色天赋
   */
  talent: TalentMap[];
  /**
   * 创建时间
   */
  create_time: Date;
  /**
   * 更新时间
   */
  update_time: Date;
}

const schema = new Schema<IRole>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

const Role = mongoose.model<IRole>('Role', schema, 'role');

export default Role;
