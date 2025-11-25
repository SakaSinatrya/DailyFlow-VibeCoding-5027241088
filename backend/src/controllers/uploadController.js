const asyncHandler = require("../utils/asyncHandler")

const handleUpload = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" })
  }

  const fileUrl = `/uploads/${req.file.filename}`

  res.status(201).json({
    file: {
      url: fileUrl,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
    },
  })
})

module.exports = {
  handleUpload,
}


