const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleAuth,
  forgotPasswordOtp,
  verifyOtpOnly,
  resetPasswordWithOtp,
  getMe,
  getAllUsers
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Standard Auth
router.post('/register', registerUser);
router.post('/login', loginUser);

// Google Sign-In (Direct Staff Auth)
router.post('/google-auth', googleAuth);

// Forgot Password via Gmail OTP
router.post('/forgot-password', forgotPasswordOtp);
router.post('/verify-otp', verifyOtpOnly);
router.post('/reset-password-otp', resetPasswordWithOtp);

// Profile & Admin users
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getAllUsers);

module.exports = router;
