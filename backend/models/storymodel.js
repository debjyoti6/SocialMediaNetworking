const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // expires in 24 hours (86400 seconds)
  }
});

module.exports = mongoose.model('Story', storySchema);
