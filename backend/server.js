const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT;
mongoose.connect(process.env.ATLAS_URI);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});
// Import routes
const userRoutes = require('./routes/userroute');
const postRoutes = require('./routes/postroute');
const commentRoutes = require('./routes/commentroute');
const storyRoutes = require('./routes/storyroute');
const messageRoutes = require('./routes/messageroute');
const notificationRoutes = require('./routes/notificationroute');

// Define your routes here
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
    res.send('Multiverse Backend Running');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});