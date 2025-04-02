import { ISignupRecord } from '../models/SignupRecord';

export interface SignupRecord
  extends Pick<ISignupRecord, 'role_id' | 'talent' | 'classes' | 'role_name' | 'user_id' | 'play_time' | 'user_name'> {
  id: ISignupRecord['_id'];
}

export interface IAddSignupRecordBody {
  ids: Array<ISignupRecord['role_id']>;
}
export interface IAddSignupRecordResponse extends Array<SignupRecord> {}
export interface IDelSignupRecordBody {
  ids: Array<ISignupRecord['role_id']>;
}

export interface IAllSignupRecordResponse extends Array<SignupRecord> {}

export interface IRecreateRecordBody {
  ids: Array<ISignupRecord['role_id']>;
}
