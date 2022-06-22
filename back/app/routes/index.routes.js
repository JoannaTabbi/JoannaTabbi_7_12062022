const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const postRoutes = require('./post.routes');
const commentRoutes = require('./comment.routes');

// common paths for users routes / posts / communities
router.use('/auth', userRoutes);
router.use('/post', postRoutes);
router.use('/post/:id/comment', commentRoutes);

module.exports = router;