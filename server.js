const app = require('./src/app');
const connectDB = require('./src/config/db');
const { port } = require('./src/config/app.config');
const logger = require('./src/config/logger');

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      logger.info('Notes Service started', { port });
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
};

startServer();
