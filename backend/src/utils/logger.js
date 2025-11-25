const util = require('util')

const levelOrder = { error: 0, warn: 1, info: 2, debug: 3 }
const MIN_LEVEL = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')

function shouldLog(level) {
  return levelOrder[level] <= levelOrder[MIN_LEVEL]
}

function formatMessage(level, message, meta) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message: typeof message === 'string' ? message : util.inspect(message, { depth: 4 }),
    pid: process.pid,
    service: process.env.npm_package_name || 'backend',
    env: process.env.NODE_ENV || 'development',
    meta: meta || null,
  }
  return JSON.stringify(payload)
}

function info(message, meta) {
  if (!shouldLog('info')) return
  console.log(formatMessage('info', message, meta))
}

function warn(message, meta) {
  if (!shouldLog('warn')) return
  console.warn(formatMessage('warn', message, meta))
}

function error(message, meta) {
  if (!shouldLog('error')) return
  console.error(formatMessage('error', message, meta))
}

function debug(message, meta) {
  if (!shouldLog('debug')) return
  console.log(formatMessage('debug', message, meta))
}

module.exports = { info, warn, error, debug }
