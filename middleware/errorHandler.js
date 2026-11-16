function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Endpoint bulunamadı.',
    path: req.originalUrl,
  });
}

function errorHandler(error, req, res, next) {
  console.error(error);

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    error: error.message || 'Beklenmeyen sunucu hatası.',
  });
}

module.exports = { notFoundHandler, errorHandler };
