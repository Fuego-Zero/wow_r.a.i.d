import { ISignupRecord } from '../models/SignupRecord';

interface SignupRecord
  extends Pick<ISignupRecord, 'role_id' | 'talent' | 'classes' | 'role_name' | 'user_id' | 'play_time' | 'user_name'> {
  id: string;
}

export interface IAddSignupRecordBody extends Pick<ISignupRecord, 'role_id'> {}
export interface IAddSignupRecordResponse extends SignupRecord {}
export interface IDelSignupRecordBody extends Pick<ISignupRecord, 'id'> {}
