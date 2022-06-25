const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const postRoutes = require('./post.routes');
const commentRoutes = require('./comment.routes');

// common paths for users / posts / comments routes
router.use('/auth', userRoutes);
router.use('/posts', postRoutes);
router.use('/posts/:id/comments', commentRoutes);

module.exports = router;