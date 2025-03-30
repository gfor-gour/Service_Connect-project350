const User = require('../models/User');

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    console.log('Search query:', query); // Debug query
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { workType: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } }  // ✅ Added address field to search
      ]
    }).select('-password');

    console.log('Found users:', users); // Debug fetched users
    res.status(200).json(users);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'An error occurred during search' });
  }
};
