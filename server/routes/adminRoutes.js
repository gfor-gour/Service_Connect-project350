const express = require('express');
const { loginAdmin, getAllUsers, deleteUser } = require('../controllers/adminController');

const router = express.Router();
router.post('/login',loginAdmin);
router.get('/users', getAllUsers); 
// Get all users (admin only)
router.delete('/delete/:userId',deleteUser); // Delete a user by ID (admin only)
module.exports = router;