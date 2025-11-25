const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const { getOverview } = require("../controllers/overviewController")

const router = express.Router()

router.get("/", authMiddleware, getOverview)

module.exports = router


