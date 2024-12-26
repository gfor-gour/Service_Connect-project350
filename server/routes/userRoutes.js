const express = require('express');
const { createUser, getUsers } = require('../controllers/userController');

const router = express.Router();

// Route to create a user
router.post('/', createUser);

// Route to get all users
router.get('/', getUsers);

module.exports = router;
