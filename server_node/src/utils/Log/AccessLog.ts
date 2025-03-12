import BaseLog from './BaseLog';

class AccessLog extends BaseLog {
  constructor() {
    super('access.log');
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
    response: any,
  ): void {
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
        response,
      }),
    );
  }
}

export default new AccessLog();
