import { BizException, isBizException } from '@yfsdk/web-basic-library';
import { Context } from 'koa';

import { IAddSignupRecordBody, IDelSignupRecordBody } from '../interfaces/ISignupRecord';
import SignupRecordService from '../services/SignupRecordService';

class SignupRecordController {
  private static validateAddRecordParams(body: any): asserts body is IAddSignupRecordBody {
    if (!body) throw new BizException('body is undefined');
    const { role_id } = body as IAddSignupRecordBody;
    if (role_id === undefined) throw new BizException(`body.role_id is error`);
  }

  private static validateDelRoleParams(body: any): asserts body is IDelSignupRecordBody {
    if (!body) throw new BizException('body is undefined');
    const { id } = body as IDelSignupRecordBody;
    if (id === undefined) throw new BizException(`body.id is error`);
  }

  static async addRecord(ctx: Context) {
    try {
      SignupRecordController.validateAddRecordParams(ctx.request.body);
      const res = await SignupRecordService.addRecord(ctx.state.user.id, ctx.request.body.role_id);
      ctx.success(res);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }

  static async delRecord(ctx: Context) {
    try {
      SignupRecordController.validateDelRoleParams(ctx.request.body);
      const res = await SignupRecordService.delRecord(ctx.request.body.id);
      ctx.success(res);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }

  static async getAllRecord(ctx: Context) {
    try {
      const res = await SignupRecordService.getAllRecord(ctx.state.user.id);
      ctx.success(res);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }
}

export default SignupRecordController;
