const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const noteRoutes = require('./routes/noteRoutes');
const { sendSuccess, sendError } = require('./utils/response');
const logger = require('./config/logger');
const httpLogger = require('./middleware/httpLogger');
const { corsOrigin, apiBasePath } = require('./config/app.config');

const app = express();

app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);
app.use(helmet());
app.use(httpLogger);
app.use(express.json());

app.get('/health', (req, res) => {
  return sendSuccess(res, {
    statusCode: 200,
    message: 'Service is healthy',
    data: {
      service: 'notes-service'
    }
  });
});

app.use(`${apiBasePath}/notes`, noteRoutes);

app.use((req, res) => {
  return sendError(res, {
    statusCode: 404,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    method: req.method,
    path: req.originalUrl,
    error: err.message
  });
  return sendError(res, {
    statusCode: 500,
    message: 'Internal server error'
  });
});

module.exports = app;
