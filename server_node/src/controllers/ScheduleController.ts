import { BizException, isArray, isBizException } from '@yfsdk/web-basic-library';
import { Context } from 'koa';

import { ISaveScheduleBody } from '../interfaces/ISchedule';
import ScheduleService from '../services/ScheduleService';

class ScheduleController {
  private static validateSaveScheduleParams(body: any): asserts body is ISaveScheduleBody {
    if (!body) throw new BizException('body is undefined');
    const schedule = body as ISaveScheduleBody;
    if (!isArray(schedule)) throw new BizException(`body.schedule is error`);
  }

  static async getSchedule(ctx: Context) {
    try {
      const res = await ScheduleService.getSchedule(ctx.state.user.id);
      ctx.success(res);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }

  static async saveSchedule(ctx: Context) {
    try {
      ScheduleController.validateSaveScheduleParams(ctx.request.body);
      const res = await ScheduleService.saveSchedule(ctx.state.user.id, ctx.request.body);
      ctx.success(res);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }
}

export default ScheduleController;
