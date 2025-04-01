const jwt = require('jsonwebtoken');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// Middleware to protect routes and authenticate the user
exports.protect = async (req, res, next) => {
  let token;

  // Check if the token is passed via Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Extract token from 'Bearer <token>'
  }

  // If no token is found, return an error
  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access this route. Token missing.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user exists in the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User does not exist. Authorization denied.' });
    }

    req.user = user; // Attach user info to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Invalid token. Authorization denied.' });
  }
};

// Get all conversations for the authenticated user
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.id })
      .populate('participants', 'name email') // Populate participant details
      .sort('-updatedAt'); // Sort by latest updated time

    if (conversations.length === 0) {
      return res.status(404).json({ message: 'No conversations found.' });
    }

    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Internal server error while fetching conversations.' });
  }
};

// Get or create a conversation between two users
exports.getOrCreateConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user.id;

    // Check if the user is trying to create a conversation with themselves
    if (userId === currentUser) {
      return res.status(400).json({ message: 'You cannot create a conversation with yourself.' });
    }

    // Validate if the target user exists
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Find or create a conversation between the users
    let conversation = await Conversation.findOne({
      participants: { $all: [currentUser, userId] },
    }).populate('participants', 'name email');

    // If no conversation found, create a new one
    if (!conversation) {
      conversation = new Conversation({ participants: [currentUser, userId] });
      await conversation.save();
      await conversation.populate('participants', 'name email');
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error('Error getting or creating conversation:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get all messages for a specific conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Find the conversation and ensure the user is a participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied. You are not a participant in this conversation.' });
    }

    // Fetch messages for the conversation
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name email') // Populate sender details
      .sort('createdAt'); // Sort by message creation time

    if (messages.length === 0) {
      return res.status(404).json({ message: 'No messages found.' });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Send a message in a specific conversation
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    // Validate if content is provided
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Message content cannot be empty.' });
    }

    // Validate the conversation and participant access
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied. You are not authorized to send a message in this conversation.' });
    }

    // Save the new message
    const newMessage = new Message({
      conversation: conversation._id,
      sender: req.user.id,
      content,
    });
    await newMessage.save();

    // Update the conversation's last message and timestamp
    conversation.lastMessage = content;
    conversation.updatedAt = new Date();
    await conversation.save();

    // Populate sender details in the message
    const populatedMessage = await newMessage.populate('sender', 'name email');

    // Emit the new message via Socket.IO (if applicable)
    req.app.get('io').to(conversation._id.toString()).emit('receive message', populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
