const express = require('express');
const router = express.Router();
const { signup, login, getMe, getOrganizers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/organizers', protect, getOrganizers);

module.exports = router;

