const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const { protect } = require('../middleware/auth');


router.get('/', protect, conversationController.getConversations);

router.get('/:userId', protect, conversationController.getOrCreateConversation);

router.post('/:userId', protect, conversationController.getOrCreateConversation);

router.get('/:conversationId/messages', protect, conversationController.getMessages);

router.post('/:conversationId/messages', protect, conversationController.sendMessage);

module.exports = router;
