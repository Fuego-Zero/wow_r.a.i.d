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
   * 自动报名
   */
  auto_signup: boolean;
  /**
   * 是否禁用报名
   */
  disable_schedule: boolean;
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
    auto_signup: {
      type: Boolean,
      required: true,
      default: true,
    },
    disable_schedule: {
      type: Boolean,
      required: true,
      default: false,
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
