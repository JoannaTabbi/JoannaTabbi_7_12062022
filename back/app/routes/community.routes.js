const express = require('express');
const router = express.Router();
const communityCtrl = require('../controllers/community.controllers');
const auth = require('../middleware/auth');


/**
 * searche for the specified community routes 
 * and methods given in the request, then call the callback functions
 * that match the request (read one, read all, create etc...)
 */
router.get("/:id", auth, communityCtrl.readOneCommunity);
router.get("/", auth, communityCtrl.readAllCommunities);
router.post("/", auth, multer, communityCtrl.createCommunity);
router.patch('/:id/follow', auth, communityCtrl.follow);
router.patch('/:id/unfollow', auth, communityCtrl.unfollow);
router.patch("/:id/subscribe", auth, communityCtrl.subscribe);
router.patch("/:id/unsubscribe", auth, communityCtrl.unsubscribe);
router.put("/:id", auth, multer, communityCtrl.updateCommunity);
router.delete("/:id", auth, communityCtrl.deleteCommunity);
router.post('/:id/report', auth, communityCtrl.reportCommunity);


module.exports = router;