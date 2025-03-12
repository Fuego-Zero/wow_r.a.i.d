import { BizException } from '@yfsdk/web-basic-library';
import { Md5 } from 'ts-md5';

import { ISignature } from './ISignature';

enum HandleType {
  qs,
  stringify,
}

export class Md5Signature implements ISignature {
  private qs(obj: object) {
    let str = '';

    Object.entries(obj).forEach(([key, value]) => {
      if (Object.prototype.toString.call(value) === '[object Object]') {
        str += `${this.qs(value)}&`;
      } else {
        str += `${key}=${value}&`;
      }
    });

    return str.slice(0, -1);
  }

  private sortASCII(obj: { [key: string]: any }) {
    const arr = Object.keys(obj);
    const sortObj: { [key: string]: any } = {};

    arr.sort().forEach((iterator) => {
      sortObj[iterator] = obj[iterator];
    });

    return sortObj;
  }

  private handleObj(obj: object, type: HandleType, key?: string) {
    switch (type) {
      case HandleType.qs:
        return this.qs(this.sortASCII({ ...obj, SIGNKEY: key })); /* cspell: disable-line */

      case HandleType.stringify:
        return JSON.stringify(this.sortASCII(obj));

      default:
        throw new BizException(`unknown type：${type}`);
    }
  }

  private hashObj(obj: object, type: HandleType, key?: string) {
    return Md5.hashStr(this.handleObj(obj, type, key));
  }

  sign(key: string, data: any): string {
    try {
      if (data.BODY) {
        data.BODY = this.hashObj(data.BODY, HandleType.stringify);
      }

      Object.entries(data).forEach(([_key, value]) => {
        if (value === undefined) delete data[_key];
      });

      return this.hashObj(data, HandleType.qs, key).toUpperCase();
    } catch (e) {
      console.error(e);
      throw new BizException((e as Error).message);
    }
  }
}
