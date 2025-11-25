const bcrypt = require("bcryptjs")
const User = require("../models/User")
const asyncHandler = require("../utils/asyncHandler")
const generateToken = require("../utils/generateToken")

const buildAuthResponse = (user) => ({
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    dateOfBirth: user.dateOfBirth,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  },
})

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, dateOfBirth, avatarUrl } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" })
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(409).json({ message: "Email already registered" })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
    avatarUrl,
  })

  const token = generateToken(user._id)

  res.status(201).json({
    ...buildAuthResponse(user),
    token,
  })
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" })
  }

  const user = await User.findOne({ email }).select("+password")
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  const token = generateToken(user._id)

  res.json({
    ...buildAuthResponse(user),
    token,
  })
})

const getCurrentUser = asyncHandler(async (req, res) => {
  res.json(buildAuthResponse(req.user))
})

const logoutUser = asyncHandler(async (_req, res) => {
  res.json({ message: "Logged out" })
})

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
}


