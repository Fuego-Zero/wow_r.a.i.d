import { ISignupRecord } from '../models/SignupRecord';

export interface SignupRecord
  extends Pick<ISignupRecord, 'role_id' | 'talent' | 'classes' | 'role_name' | 'user_id' | 'play_time' | 'user_name'> {
  id: ISignupRecord['_id'];
}

export interface IAddSignupRecordBody extends Pick<ISignupRecord, 'role_id'> {}
export interface IAddSignupRecordResponse extends SignupRecord {}
export interface IDelSignupRecordBody extends Pick<ISignupRecord, 'id'> {}
export interface IAllSignupRecordResponse extends Array<SignupRecord> {}
