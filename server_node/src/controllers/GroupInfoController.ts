import { BizException, isBizException } from '@yfsdk/web-basic-library';
import { Context } from 'koa';

import { ISaveGroupInfoBody } from '../interfaces/IGroupInfo';
import GroupInfoService from '../services/GroupInfoService';

class GroupInfoController {
  static async getGroupInfo(ctx: Context) {
    try {
      const res = await GroupInfoService.getGroupInfo(ctx.state.user.id);
      ctx.success(res);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }

  private static validateSaveGroupInfoParams(body: any): asserts body is ISaveGroupInfoBody {
    if (!body) throw new BizException('body is undefined');
  }

  static async saveGroupInfo(ctx: Context) {
    try {
      GroupInfoController.validateSaveGroupInfoParams(ctx.request.body);
      const res = await GroupInfoService.saveGroupInfo(ctx.state.user.id, ctx.request.body);
      ctx.success(res);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }
}

export default GroupInfoController;
