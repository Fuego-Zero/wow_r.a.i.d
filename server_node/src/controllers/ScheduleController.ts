import { isBizException } from '@yfsdk/web-basic-library';
import { Context } from 'koa';

import ScheduleService from '../services/ScheduleService';

class ScheduleController {
  static async getSchedule(ctx: Context) {
    try {
      const res = await ScheduleService.getSchedule(ctx.state.user.id);
      ctx.success(res);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }
}

export default ScheduleController;
