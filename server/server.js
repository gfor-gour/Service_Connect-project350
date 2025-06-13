const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const nodemailer = require('nodemailer');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Make io accessible throughout the app
app.set('io', io);

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection (updated to remove deprecated options)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const searchRoutes = require('./routes/searchRoutes');
const generateRoutes = require('./routes/generateRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/conversations', conversationRoutes);
app.use("/api/generate", generateRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin',adminRoutes)

// Socket.IO events
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join conversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('leave conversation', (conversationId) => {
    socket.leave(conversationId);
  });

  socket.on('new message', async (message) => {
    try {
      if (!message.conversation || !message.sender || !message.content) {
        throw new Error('Missing required fields in message');
      }

      const newMessage = new Message({
        conversation: message.conversation,
        sender: message.sender,
        content: message.content,
        createdAt: new Date(),
      });

      const savedMessage = await newMessage.save();

      await Conversation.findByIdAndUpdate(message.conversation, {
        lastMessage: message.content,
        updatedAt: new Date(),
      });

      io.to(message.conversation).emit('receive message', savedMessage);
    } catch (error) {
      console.error('Error handling new message:', error);
      socket.emit('message error', { error: error.message });
    }
  });

  socket.on('typing', (data) => {
    socket.to(data.conversation).emit('user typing', {
      user: data.user,
      isTyping: data.isTyping,
    });
  });

  socket.on('user online', (userId) => {
    socket.join(userId);
    io.emit('user status', { userId, status: 'online' });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    io.emit('user status', { userId: socket.id, status: 'offline' });
  });
});

// Test email route
app.get('/api/test-email', async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: process.env.SMTP_EMAIL,
      subject: 'Test Email',
      text: 'If you receive this email, your email configuration is working.',
      html: '<h1>Test Email</h1><p>If you receive this email, your email configuration is working.</p>',
    });

    console.log('Test email sent:', info.response);
    res.status(200).json({ message: 'Test email sent successfully', info: info.response });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ message: 'Error sending test email', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully.');
  server.close(() => {
    console.log('Server closed.');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});
