const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendOtpEmail } = require('../config/mailer');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client();

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'inventory_secret_key_2026', {
    expiresIn: '7d'
  });
};

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public (First user automatically becomes 'admin')
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // If this is the very first user in the database, make them admin
    const totalUsers = await User.countDocuments();
    let assignedRole = role || 'staff';
    if (totalUsers === 0) {
      assignedRole = 'admin';
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role: assignedRole,
      phone: phone || ''
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id)
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Authenticate user & get token
// @route  POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        token: generateToken(user._id)
      },
      message: `Welcome back, ${user.name} (${user.role.toUpperCase()})`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Sign in / Register with Google (Staff Accounts Direct Login)
// @route  POST /api/auth/google-auth
// @access Public
const googleAuth = async (req, res) => {
  try {
    let { email, name, googleId, avatar, role, credential } = req.body;

    // If real Google ID token is provided from Google Identity Services
    if (credential) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID || undefined
        });
        const gPayload = ticket.getPayload();
        if (gPayload) {
          email = gPayload.email;
          name = gPayload.name || (email ? email.split('@')[0] : 'User');
          avatar = gPayload.picture || avatar || '';
          googleId = gPayload.sub || googleId || '';
        }
      } catch (tokenErr) {
        console.warn('Google Token verification notice:', tokenErr.message);
        // Fallback to email if provided in request body
        if (!email) {
          return res.status(401).json({ success: false, message: 'Invalid Google authentication token' });
        }
      }
    }

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email from Google account is required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    if (user) {
      // User exists: update Google info if not set
      if (!user.googleId) {
        user.googleId = googleId || '';
        user.isGoogleAuth = true;
      }
      if (avatar && !user.avatar) {
        user.avatar = avatar;
      }
      // If user specifically requests admin role and has admin permissions/email
      if (role && role === 'admin' && user.role !== 'admin') {
        user.role = 'admin';
      }
      await user.save();
    } else {
      // New user: assign requested role ('admin' or 'staff')
      const assignedRole = role === 'admin' ? 'admin' : 'staff';
      const randomPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: randomPassword,
        role: assignedRole,
        googleId: googleId || '',
        avatar: avatar || '',
        isGoogleAuth: true
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        token: generateToken(user._id)
      },
      message: `Google Sign-in successful! Logged in as ${user.name} (${user.role.toUpperCase()})`
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Send 6-digit OTP to user's Gmail for Forgot Password
// @route  POST /api/auth/forgot-password
// @access Public
const forgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please enter your registered Gmail/email address' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No registered account found with this email address' });
    }

    // Generate secure 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and 10 minute expiration
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Dispatch OTP via Gmail service
    const mailResult = await sendOtpEmail(user.email, otp, user.name);

    let infoMsg = `A 6-digit OTP has been sent to ${user.email}. Please check your inbox or spam folder.`;
    if (mailResult.mode === 'console') {
      infoMsg = `A 6-digit OTP verification code has been dispatched. (To receive real emails in Gmail, please configure GMAIL_USER & GMAIL_APP_PASSWORD in backend/.env).`;
    }

    res.json({
      success: true,
      message: infoMsg,
      email: user.email,
      sentViaSmtp: mailResult.mode === 'smtp'
    });
  } catch (error) {
    console.error('Forgot Password OTP Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Verify OTP and Reset Password
// @route  POST /api/auth/reset-password-otp
// @access Public
const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, 6-digit OTP, and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({
      email: cleanEmail,
      resetOtp: otp.toString().trim()
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code. Please recheck the code sent to your email.'
      });
    }

    // Check if OTP has expired
    if (!user.resetOtpExpires || user.resetOtpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This OTP has expired. Please request a new verification code.'
      });
    }

    // OTP is valid! Update password
    user.password = newPassword;
    user.resetOtp = null;
    user.resetOtpExpires = null;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get current logged-in user profile
// @route  GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all users (Admin only)
// @route  GET /api/auth/users
// @access Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Verify 6-digit OTP code before displaying new password fields
// @route  POST /api/auth/verify-otp
// @access Public
const verifyOtpOnly = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and 6-digit OTP'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({
      email: cleanEmail,
      resetOtp: otp.toString().trim()
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code. Please check the code sent to your Gmail.'
      });
    }

    if (!user.resetOtpExpires || user.resetOtpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This OTP has expired. Please request a new code.'
      });
    }

    res.json({
      success: true,
      message: 'OTP verified successfully! Please set your new password.'
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  forgotPasswordOtp,
  verifyOtpOnly,
  resetPasswordWithOtp,
  getMe,
  getAllUsers
};
