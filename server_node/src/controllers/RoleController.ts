import { BizException, isBizException } from '@yfsdk/web-basic-library';
import { Context } from 'koa';

import { IBindRoleBody, IChangeRoleDisableScheduleBody, IUnbindRoleBody, IUpdateRoleBody } from '../interfaces/IRole';
import RoleService from '../services/RoleService';

class RoleController {
  private static validateBindRoleParams(body: any): asserts body is IBindRoleBody {
    if (!body) throw new BizException('body is undefined');

    const { classes, role_name, talent } = body as IBindRoleBody;

    if (role_name === undefined) throw new BizException(`body.role_name is undefined`);
    if (role_name === '') throw new BizException(`body.role_name is empty`);
    if (classes === undefined) throw new BizException(`body.classes is undefined`);
    if (talent === undefined) throw new BizException(`body.talent is undefined`);
  }

  private static validateUnbindRoleParams(body: any): asserts body is IUnbindRoleBody {
    if (!body) throw new BizException('body is undefined');
    const { id } = body as IUnbindRoleBody;
    if (id === undefined) throw new BizException(`body.id is undefined`);
  }

  static async bindRole(ctx: Context) {
    try {
      RoleController.validateBindRoleParams(ctx.request.body);
      const res = await RoleService.bindRole(ctx.state.user.id, ctx.request.body);
      ctx.success(res);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }

  static async unBindRole(ctx: Context) {
    try {
      RoleController.validateUnbindRoleParams(ctx.request.body);
      const res = await RoleService.unbindRole(ctx.state.user.id, ctx.request.body.id);
      ctx.success(res);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }

  private static validateUpdateRoleParams(body: any): asserts body is IUpdateRoleBody {
    if (!body) throw new BizException('body is undefined');
    const { id } = body as IUpdateRoleBody;
    if (id === undefined) throw new BizException(`body.id is undefined`);
    RoleController.validateBindRoleParams(body);
  }

  static async updateRole(ctx: Context) {
    try {
      RoleController.validateUpdateRoleParams(ctx.request.body);
      const res = await RoleService.updateRole(ctx.state.user.id, ctx.request.body);
      ctx.success(res);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }

  static async getAllRole(ctx: Context) {
    try {
      const res = await RoleService.getAllRole(ctx.state.user.id);
      ctx.success(res);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }

  private static validateChangeRoleDisableScheduleParams(body: any): asserts body is IChangeRoleDisableScheduleBody {
    if (!body) throw new BizException('body is undefined');
    const { id, disable_schedule } = body as IChangeRoleDisableScheduleBody;
    if (id === undefined) throw new BizException(`body.id is undefined`);
    if (disable_schedule === undefined) throw new BizException(`body.disable_schedule is undefined`);
  }

  static async changeRoleDisableSchedule(ctx: Context) {
    try {
      RoleController.validateChangeRoleDisableScheduleParams(ctx.request.body);
      const res = await RoleService.changeRoleDisableSchedule(ctx.state.user.id, ctx.request.body);
      ctx.success(res);
    } catch (error) {
      if (isBizException(error)) ctx.bizError(error.message);
      throw error;
    }
  }
}

export default RoleController;
