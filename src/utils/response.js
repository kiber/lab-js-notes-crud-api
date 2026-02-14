const sendSuccess = (res, { statusCode = 200, message = 'Success', data, meta } = {}) => {
  const payload = {
    status: 'success',
    message
  };

  if (data !== undefined) {
    payload.data = data;
  }

  if (meta !== undefined) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

const sendError = (res, { statusCode = 500, message = 'Internal server error', error } = {}) => {
  const payload = {
    status: 'error',
    message
  };

  if (error !== undefined) {
    payload.error = error;
  }

  return res.status(statusCode).json(payload);
};

module.exports = {
  sendSuccess,
  sendError
};
