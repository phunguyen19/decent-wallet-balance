import { logger } from './logger';

const now = +new Date();
const memory: number[] = [];
setInterval(() => {
  const current = process.memoryUsage().rss / 1024 / 1024;
  memory.push(current);
  const second = (+new Date() - now) / 1000;
  const memInMb = memory.reduce((prev, curr) => prev + curr) / second;
  logger.info(
    `Monitor: Current: ${current.toFixed(2)} MB average: ${memInMb.toFixed(
      2,
    )} / s in ${second} seconds`,
  );
}, 1000);
