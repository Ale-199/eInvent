const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    //err.stack will show you where the exact location of the error in the file.
    stack: process.env.NODE_DEV === "development" ? err.stack : null,
  });
};

module.exports = errorHandler;
