const { sendSuccess, sendError } = require('../../src/utils/response');

const createResMock = () => {
  return {
    statusCode: null,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    }
  };
};

it('sendSuccess returns expected shape with data and meta', () => {
  const res = createResMock();

  const result = sendSuccess(res, {
    statusCode: 201,
    message: 'Created',
    data: { id: 'n1' },
    meta: { page: 1 }
  });

  expect(result).toBe(res);
  expect(res.statusCode).toBe(201);
  expect(res.payload).toEqual({
    status: 'success',
    message: 'Created',
    data: { id: 'n1' },
    meta: { page: 1 }
  });
});

it('sendError returns expected shape with optional error details', () => {
  const res = createResMock();

  const result = sendError(res, {
    statusCode: 404,
    message: 'Not found',
    error: 'Missing note'
  });

  expect(result).toBe(res);
  expect(res.statusCode).toBe(404);
  expect(res.payload).toEqual({
    status: 'error',
    message: 'Not found',
    error: 'Missing note'
  });
});

it('sendSuccess and sendError default values', () => {
  const successRes = createResMock();
  const errorRes = createResMock();

  sendSuccess(successRes);
  sendError(errorRes);

  expect(successRes.statusCode).toBe(200);
  expect(successRes.payload).toEqual({
    status: 'success',
    message: 'Success'
  });

  expect(errorRes.statusCode).toBe(500);
  expect(errorRes.payload).toEqual({
    status: 'error',
    message: 'Internal server error'
  });
});
