const express = require('express');
const router = express.Router();
const Message = require('../models/messagemodel');

// Get messages between two users
router.get('/:user1Id/:user2Id', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.params.user1Id, receiverId: req.params.user2Id },
        { senderId: req.params.user2Id, receiverId: req.params.user1Id }
      ]
    }).sort({ createdAt: 1 }); // Sort by time

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send a message
router.post('/', async (req, res) => {
  const message = new Message({
    senderId: req.body.senderId,
    receiverId: req.body.receiverId,
    text: req.body.text
  });

  try {
    const newMessage = await message.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
