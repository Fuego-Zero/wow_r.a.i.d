import { isBizException } from '@yfsdk/web-basic-library';
import { Context } from 'koa';

import ConfigService from '../services/ConfigService';

class ConfigController {
  static async getRaidTime(ctx: Context) {
    try {
      const res = await ConfigService.getRaidTime();
      ctx.success(res);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }
}

export default ConfigController;
