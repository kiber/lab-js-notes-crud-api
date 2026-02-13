const authClient = require('../config/axios');
const { sendError } = require('../utils/response');
const logger = require('../config/logger');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, {
        statusCode: 401,
        message: 'Unauthorized: No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    // Call Auth Service
    const response = await authClient.post(
      '/auth/verify',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.data.data.valid) {
      return sendError(res, {
        statusCode: 401,
        message: 'Unauthorized: Invalid token'
      });
    }

    // Attach userId to request
    req.userId = response.data.data.userId;

    next();
  } catch (error) {
    logger.warn('Auth middleware verification failed', {
      error: error.message,
      path: req.originalUrl
    });
    return sendError(res, {
      statusCode: 401,
      message: 'Unauthorized'
    });
  }
};

module.exports = authMiddleware;
