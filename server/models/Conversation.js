const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Virtual field to populate participant details
conversationSchema.virtual('participantDetails', {
  ref: 'User',
  localField: 'participants',
  foreignField: '_id',
});

module.exports = mongoose.model('Conversation', conversationSchema);
