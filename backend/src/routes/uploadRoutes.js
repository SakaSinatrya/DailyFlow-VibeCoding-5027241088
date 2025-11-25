const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const authMiddleware = require("../middleware/authMiddleware")
const { handleUpload } = require("../controllers/uploadController")

const router = express.Router()

const resolveUploadDir = () => {
  const configured = process.env.UPLOAD_DIR || "uploads"
  return path.isAbsolute(configured) ? configured : path.join(process.cwd(), configured)
}

const uploadDir = resolveUploadDir()
fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${ext}`)
  },
})

const upload = multer({ storage })

router.post("/", authMiddleware, upload.single("file"), handleUpload)

module.exports = router


