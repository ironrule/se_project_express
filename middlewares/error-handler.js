const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

function errorHandler(err, req, res, next) {
  console.error(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === ERROR_CODES.SERVER_ERROR
        ? ERROR_MESSAGES.SERVER_ERROR
        : message,
  });
}

module.exports = errorHandler;
