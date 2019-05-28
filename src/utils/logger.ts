import * as winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({ format: winston.format.cli() }),
  ],
});
