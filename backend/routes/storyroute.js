const express = require('express');
const router = express.Router();
const Story = require('../models/storymodel');

// Get all stories
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find().populate('userId', 'username profilePicture');
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a story
router.post('/', async (req, res) => {
  const story = new Story({
    userId: req.body.userId,
    image: req.body.image,
    content: req.body.content
  });

  try {
    const newStory = await story.save();
    res.status(201).json(newStory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a story
router.delete('/:id', async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    res.json({ message: 'Story deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
