import { isBizException } from '@yfsdk/web-basic-library';
import { Context } from 'koa';

import WCLRankingsService from '../services/WCLRankingsService';

class CommonController {
  static async getWCLRankings(ctx: Context) {
    try {
      const res = await WCLRankingsService.getWCLRankings();
      ctx.success(res);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }
}

export default CommonController;
