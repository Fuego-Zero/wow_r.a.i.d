import fs from 'fs';
import path from 'path';

abstract class BaseLog {
  protected logStream: fs.WriteStream;

  constructor(logName: string) {
    const dirPath = path.join(process.cwd(), 'logs');
    const logPath = path.join(dirPath, logName);

    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);

    this.logStream = fs.createWriteStream(logPath, { flags: 'a' });
  }

  protected write(log: string) {
    this.logStream.write(`${log}\n`);
  }

  protected getUsedTime(startTime: number, endTime: number) {
    return endTime - startTime;
  }
}

export default BaseLog;
