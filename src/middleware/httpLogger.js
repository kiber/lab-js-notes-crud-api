const logger = require('../config/logger');

const httpLogger = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationNs = process.hrtime.bigint() - start;
    const durationMs = Number(durationNs) / 1e6;

    logger.info('HTTP request completed', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: Number(durationMs.toFixed(2))
    });
  });

  next();
};

module.exports = httpLogger;
