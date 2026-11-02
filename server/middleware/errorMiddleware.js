export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err);

  const statusCode = err.status || err.statusCode || 500;
  const isProduction = String(process.env.NODE_ENV || '').toLowerCase() === 'production';

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
    ...(isProduction ? {} : { stack: err.stack }),
  });
};
