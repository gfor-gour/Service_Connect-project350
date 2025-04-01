const express = require("express");
const router = express.Router();
const { generateContent } = require("../controllers/generateController");

// Define the POST route
router.post("/", generateContent);

module.exports = router;
