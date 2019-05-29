"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
exports.logger = winston.createLogger({
    level: 'info',
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.Console({ format: winston.format.cli() }),
    ],
});
//# sourceMappingURL=logger.js.map