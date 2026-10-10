const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema (Admin & Staff roles with Google Auth & OTP fields)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide user name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6
    },
    role: {
      type: String,
      enum: ['admin', 'staff'],
      default: 'staff'
    },
    phone: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    googleId: {
      type: String,
      default: ''
    },
    isGoogleAuth: {
      type: Boolean,
      default: false
    },
    // Forgot Password OTP verification fields
    resetOtp: {
      type: String,
      default: null
    },
    resetOtpExpires: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
