const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post.controllers');
const auth = require('../middleware/auth');


/**
 * searche for the specified post routes 
 * and methods given in the request, then call the callback functions
 * that match the request (read one, read all, create etc...)
 */
router.get("/:id", auth, postCtrl.readOnePost);
router.get("/", auth, postCtrl.readAllPosts);
router.post("/", auth, postCtrl.createPost);
router.post("/:id/vote", auth, postCtrl.likePost);
router.put("/:id", auth, postCtrl.updatePost);
router.delete("/:id", auth, postCtrl.deletePost);
router.post('/:id/report', auth, postCtrl.reportPost);


module.exports = router;