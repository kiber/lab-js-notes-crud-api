const axios = require('axios');
const { authServiceUrl } = require('./config');

const authClient = axios.create({
  baseURL: authServiceUrl,
  timeout: 3000
});

module.exports = authClient;
