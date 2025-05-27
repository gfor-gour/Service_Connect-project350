const express = require("express")
const router = express.Router()
const { generateContent, getChatHistory, clearChatHistory } = require("../controllers/generateController")

// Generate content route
router.post("/generate", generateContent)

// Get chat history route
router.get("/history/:sessionId", getChatHistory)

// Clear chat history route
router.delete("/history", clearChatHistory)

module.exports = router
