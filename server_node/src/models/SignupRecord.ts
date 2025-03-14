import mongoose, { Document, Schema } from 'mongoose';

import { RoleClassesMap, TalentMap } from '../common';
import { RoleId, SignupRecordId, UserId } from '../types';

export interface ISignupRecord extends Document<SignupRecordId> {
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
   * 创建时间
   */
  create_time: Date;
  /**
   * 删除时间
   */
  delete_time: Date;
}

const schema = new Schema<ISignupRecord>(
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

    create_time: {
      type: Date,
      default: Date.now,
    },
    delete_time: {
      type: Date,
    },
  },
  {
    versionKey: false,
  },
);

const SignupRecord = mongoose.model<ISignupRecord>('SignupRecord', schema, 'signup_record');

export default SignupRecord;
