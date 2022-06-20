const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controllers');
const auth = require('../middleware/auth');

/**
 * searche for the specified user routes 
 * and methods given in the request, then call the callback functions
 * that match the request (read one, read all, create etc...)
 */

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/logout', userCtrl.logout);
router.get('/:id', auth, userCtrl.readUser);
router.get('/users', auth, userCtrl.readAllUsers);
router.get('/export', auth, userCtrl.exportData);
router.put('/', auth, userCtrl.updateUser);
router.delete('/', auth, userCtrl.deleteUser);
router.patch('/:id/follow', auth, userCtrl.follow);
router.patch('/:id/unfollow', auth, userCtrl.unfollow);
router.patch('/:id/report', auth, userCtrl.reportUser);

module.exports = router;