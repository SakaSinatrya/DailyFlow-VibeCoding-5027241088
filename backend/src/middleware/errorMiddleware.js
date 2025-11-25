const logger = require("../utils/logger")
const { randomUUID } = require("crypto")

const errorHandler = (err, req, res, next) => {
  const errorId = (typeof randomUUID === 'function') ? randomUUID() : `${Date.now()}-${Math.floor(Math.random()*100000)}`
  const statusCode = err.statusCode || 500

  // Log structured error with request context and generated id
  logger.error(err.message || 'Unhandled error', {
    errorId,
    statusCode,
    path: req.originalUrl,
    method: req.method,
    user: req.user ? req.user._id : undefined,
    stack: err.stack,
    details: err.info || null,
  })

  // Optionally attach to response header for correlation
  res.setHeader('X-Error-ID', errorId)

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    errorId,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}

module.exports = errorHandler

