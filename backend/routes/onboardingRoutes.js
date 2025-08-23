// routes/onboardingRoutes.js
const express = require('express');
const router = express.Router();
const { saveOnboarding, completeOnboarding } = require('../controllers/onboardingController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /onboarding -> save user's onboarding answers
router.post('/', authMiddleware, completeOnboarding);

module.exports = router;
