const axios = require('axios');
const { authServiceUrl } = require('./app.config');
const logger = require('./logger');

const authClient = axios.create({
  baseURL: authServiceUrl,
  timeout: 3000
});

authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.warn('Auth service request failed', {
      baseURL: authServiceUrl,
      method: error.config?.method,
      url: error.config?.url,
      status: error.response?.status,
      error: error.message
    });
    return Promise.reject(error);
  }
);

module.exports = authClient;
