import BaseLog from './BaseLog';

class BizErrorLog extends BaseLog {
  private name: string;
  constructor() {
    super('biz_error.log');
    this.name = 'bizError';
  }

  record(
    traceId: string,
    ip: string,
    startTime: number,
    sign: string,
    body: any,
    query: string,
    url: string,
    token: string,
    message: string,
    stack?: string,
  ) {
    const endTime = Date.now().valueOf();

    this.write(
      JSON.stringify({
        traceId,
        ip,
        startTime,
        endTime,
        usedTime: this.getUsedTime(startTime, endTime),
        sign,
        token,
        request: {
          url,
          query,
          body,
        },
        error: {
          type: this.name,
          message,
          stack,
        },
      }),
    );
  }
}

export default new BizErrorLog();
