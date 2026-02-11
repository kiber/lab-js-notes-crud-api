const axios = require('axios');

const authClient = axios.create({
  baseURL: process.env.AUTH_SERVICE_URL,
  timeout: 3000
});

module.exports = authClient;
