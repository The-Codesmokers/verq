const express = require('express');
const { createOrUpdateUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected route - only accessible with valid Firebase token
router.post('/save', authMiddleware, createOrUpdateUser);

module.exports = router; 