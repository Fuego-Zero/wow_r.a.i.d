import { BizException } from '@yfsdk/web-basic-library';

export const throwParamsBizException = (paramName: string, paramType: string) => {
  throw new BizException(`The type of '${paramName}' is not allowed, only ${paramType} can be used.`);
};
