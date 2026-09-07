export const errorHandler = (err, req, res, next) => {
  console.error("[Error Handler]:", err);
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    message: err.message || "Terjadi kesalahan pada server",
  });
};
