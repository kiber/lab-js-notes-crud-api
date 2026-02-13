const mongoose = require('mongoose');
const { mongoUri } = require('./app.config');
const logger = require('./logger');

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected', { service: 'notes-service' });
  } catch (error) {
    logger.error('MongoDB connection failed', { error: error.message });
    process.exit(1);
  }
};

module.exports = connectDB;
