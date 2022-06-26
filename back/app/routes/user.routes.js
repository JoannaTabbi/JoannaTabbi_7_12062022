const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controllers');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const password = require('../middleware/password');
const rateLimiter = require('../middleware/rate-limiter');
const { body, validationResult } = require('express-validator');

/**
 * searche for the specified user routes 
 * and methods given in the request, then call the callback functions
 * that match the request (read one, read all, create etc...)
 */

router.post('/signup', body('email').isEmail(), password, userCtrl.signup);
router.post('/login', rateLimiter, userCtrl.login);
router.get('/logout', auth, userCtrl.logout);
router.get('/:id', auth, userCtrl.readUser);
router.get('/', auth, userCtrl.readOneself);
router.get('/users', auth, userCtrl.readAllUsers);
router.get('/export', auth, userCtrl.exportData);
router.put('/', auth, password, userCtrl.updateUser);
router.delete('/', auth, userCtrl.deleteUser);
router.patch('/:id/follow', auth, userCtrl.follow);
router.patch('/:id/unfollow', auth, userCtrl.unfollow);
router.patch('/:id/report', auth, userCtrl.reportUser);

module.exports = router;