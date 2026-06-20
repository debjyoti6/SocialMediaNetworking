const express = require('express');
const router = express.Router();
const Notification = require('../models/notificationmodel');

// Get all notifications for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ receiverId: req.params.userId })
      .populate('senderId', 'username profilePicture')
      .sort({ createdAt: -1 }); // Newest first

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a notification
router.post('/', async (req, res) => {
  const notification = new Notification({
    receiverId: req.body.receiverId,
    senderId: req.body.senderId,
    type: req.body.type,
    postId: req.body.postId
  });

  try {
    const newNotification = await notification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
