import { IRaidTime } from '../models/RaidTime';

export interface IRaidTimeResponse extends Array<Pick<IRaidTime, 'time_name' | 'time_key'>> {}
