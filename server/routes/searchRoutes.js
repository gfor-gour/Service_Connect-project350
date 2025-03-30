const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { protect } = require('../middleware/auth');


router.get('/', protect, searchController.searchUsers);

module.exports = router;