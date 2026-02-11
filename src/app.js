const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const noteRoutes = require('./routes/noteRoutes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'notes-service'
  });
});

app.use('/api/notes', noteRoutes);

module.exports = app;
