import { BizException } from '@yfsdk/web-basic-library';

import { Md5Signature } from './Md5Signature';

/**
 * 签名
 *
 * @param {string} algorithm 算法名，大小写不敏感, 目前仅支持 md5
 * @param {string} key 签名秘钥
 * @param {object} data 签名数据对象
 * @returns {string} 签名结果
 */
function sign(algorithm: string, key: string, data: any): string {
  algorithm = algorithm.toLowerCase();

  if (algorithm === 'md5') return new Md5Signature().sign(key, data);

  throw new BizException(`unsupport algorithm: ${algorithm}`);
}

export default sign;
