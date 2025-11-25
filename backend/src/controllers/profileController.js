const User = require("../models/User")
const asyncHandler = require("../utils/asyncHandler")

const getProfile = asyncHandler(async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      dateOfBirth: req.user.dateOfBirth,
      avatarUrl: req.user.avatarUrl,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    },
  })
})

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, dateOfBirth, avatarUrl } = req.body

  if (email && email !== req.user.email) {
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: "Email already in use" })
    }
    req.user.email = email
  }

  if (name) {
    req.user.name = name
  }

  if (dateOfBirth) {
    req.user.dateOfBirth = new Date(dateOfBirth)
  }

  if (avatarUrl !== undefined) {
    req.user.avatarUrl = avatarUrl
  }

  await req.user.save()

  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      dateOfBirth: req.user.dateOfBirth,
      avatarUrl: req.user.avatarUrl,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    },
  })
})

module.exports = {
  getProfile,
  updateProfile,
}


