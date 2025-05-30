const jwt = require('jsonwebtoken');
const User = require('../models/User');

const loginAdmin = async (req, res) => {
    const { username , password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        if (username === "admin" && password === "admin123") {
            const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, {
                expiresIn: '1d'
            });
            return res.status(200).json({
                message: "Login successful",
                token
            });
        }
        return res.status(401).json({ message: "Invalid credentials" });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}
const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: error.message });
    }
  };

const deleteUser = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
  
module.exports = {
    loginAdmin, getAllUsers , deleteUser
};