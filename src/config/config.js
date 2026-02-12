require('dotenv').config();

const config = {
  port: Number(process.env.PORT) || 5001,
  mongoUri: process.env.MONGO_URI,
  authServiceUrl: process.env.AUTH_SERVICE_URL
};

module.exports = config;
