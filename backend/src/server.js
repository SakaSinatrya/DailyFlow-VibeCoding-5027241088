require('dotenv').config()
const path = require('path')
const fs = require('fs')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const logger = require('./utils/logger')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorMiddleware')

const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const taskRoutes = require('./routes/taskRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const overviewRoutes = require('./routes/overviewRoutes')

const app = express()

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true)
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}

// optional Sentry initialization
if (process.env.SENTRY_DSN) {
  try {
    // prefer optional dependency; if not installed we'll log a warning
    // to enable Sentry, add '@sentry/node' to your dependencies and set SENTRY_DSN
    const Sentry = require('@sentry/node')
    Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV })
    logger.info('Sentry initialized')
    app.use(Sentry.Handlers.requestHandler())
  } catch (e) {
    logger.warn('Sentry is configured but @sentry/node is not installed')
  }
}

app.use(cors(corsOptions))
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const resolveUploadDir = () => {
  const configured = process.env.UPLOAD_DIR || 'uploads'
  return path.isAbsolute(configured) ? configured : path.join(process.cwd(), configured)
}

const uploadDir = resolveUploadDir()
fs.mkdirSync(uploadDir, { recursive: true })
app.use('/uploads', express.static(uploadDir))

// basic health and readiness endpoints
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

const mongoose = require('mongoose')
app.get('/api/readiness', (_req, res) => {
  // mongoose readyState: 1 = connected
  const ready = mongoose.connection && mongoose.connection.readyState === 1
  res.json({ ready: !!ready, state: mongoose.connection ? mongoose.connection.readyState : null })
})

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/overview', overviewRoutes)

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'Route not found' })
  }
  return next()
})

// optional Sentry error handler
if (process.env.SENTRY_DSN) {
  try {
    const Sentry = require('@sentry/node')
    app.use(Sentry.Handlers.errorHandler())
  } catch (e) {
    // ignore
  }
}

app.use(errorHandler)

const PORT = process.env.PORT || 4000

const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`)
  })
}

startServer()

module.exports = app


