function errorHandler(err, req, res, next) {
  console.error(err);

  res.status(500).json({
    success: false,
    message: statusCode === 500 ? "Internal Server Error" : err.message,
  });
}

module.exports = errorHandler;
