import { BizException, isBizException } from '@yfsdk/web-basic-library';
import { Context } from 'koa';

import { IAddSignupRecordBody } from '../interfaces/ISignupRecord';
import SignupRecordService from '../services/SignupRecordService';

class SignupRecordController {
  private static validateBindRoleParams(body: any): asserts body is IAddSignupRecordBody {
    if (!body) throw new BizException('body is undefined');
    const { role_id } = body as IAddSignupRecordBody;
    if (role_id === undefined) throw new BizException(`body.role_id is error`);
  }

  static async addRecord(ctx: Context) {
    try {
      SignupRecordController.validateBindRoleParams(ctx.request.body);
      const res = await SignupRecordService.addRecord(ctx.state.user.id, ctx.request.body.role_id);
      ctx.success(res);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }
}

export default SignupRecordController;
