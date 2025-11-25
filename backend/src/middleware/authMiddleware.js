const jwt = require("jsonwebtoken")
const User = require("../models/User")

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" })
  }

  const token = authHeader.split(" ")[1]

  // Ensure JWT secret is configured
  if (!process.env.JWT_SECRET) {
    // This is a server misconfiguration — surface as 500 so it's visible to the operator
    return res.status(500).json({ message: "Server configuration error: JWT secret is not set" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" })
    }

    req.user = user
    return next()
  } catch (error) {
    // Differentiate token errors for better debugging
    if (error && error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }
    if (error && error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }

    // Fallback to generic unauthorized
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = authMiddleware

