const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const noteRoutes = require('./routes/noteRoutes');
const { sendSuccess, sendError } = require('./utils/response');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
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

app.use('/api/notes', noteRoutes);

app.use((req, res) => {
  return sendError(res, {
    statusCode: 404,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  return sendError(res, {
    statusCode: 500,
    message: 'Internal server error'
  });
});

module.exports = app;
