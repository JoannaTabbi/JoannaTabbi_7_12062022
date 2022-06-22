const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment.controllers');
const auth = require('../middleware/auth');


/**
 * searche for the specified comment routes 
 * and methods given in the request, then call the callback functions
 * that match the request (read one, read all, create etc...)
 */
router.get("/:id", auth, commentCtrl.readOneComment);
router.get("/", auth, commentCtrl.readAllComments);
router.post("/", auth, commentCtrl.createComment);
router.post("/:id/like", auth, commentCtrl.likeComment);
router.put("/:id", auth, commentCtrl.updateComment);
router.delete("/:id", auth, commentCtrl.deleteComment);
router.post('/:id/report', auth, commentCtrl.reportComment);


module.exports = router;