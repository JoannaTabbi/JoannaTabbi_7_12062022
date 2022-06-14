const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const postRoutes = require('./post.routes');
const communityRoutes = require('./community.routes');

// common paths for users routes / posts / communities
router.use('/auth', userRoutes);
router.use('/post', postRoutes);
router.use('/community', communityRoutes);

module.exports = router;