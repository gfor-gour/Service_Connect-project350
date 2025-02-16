const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Existing routes
router.get('/profile', protect, userController.getProfile); // Get the profile of the authenticated user
router.put('/profile', protect, userController.updateProfile); // Update the profile of the authenticated user
router.get('/dashboard', protect, authorize('provider'), userController.getDashboard); // Access dashboard if user is a provider

// New route to get user details by userId (non-authenticated or different user)
router.get('/:userId', userController.getUserDetails); // Get user details by userId

module.exports = router;
