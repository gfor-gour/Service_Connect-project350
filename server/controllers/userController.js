
const User = require('../models/User');
const mongoose = require('mongoose');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, profilePicture, address, workType } = req.body;

    // Prepare update fields object
    const updateFields = {
      name,
      profilePicture,
      address
    };

    // Update workType only if the user is a provider
    if (req.user.role === 'provider') {
      if (!workType) {
        return res.status(400).json({ message: 'WorkType is required for providers.' });
      }
      updateFields.workType = workType;
    }

    // Find and update the user
    const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get provider dashboard (example)
exports.getDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Access denied. This is a provider-only resource.' });
    }

    // Logic for provider dashboard (e.g., getting work assignments, status, etc.)
    res.status(200).json({ message: 'Provider dashboard' });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user details by userId
exports.getUserDetails = async (req, res) => {
  console.log("Request to fetch user details hit");

  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId); // Replace with your database logic
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getallUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete user (optional admin functionality)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message });
  }
};
