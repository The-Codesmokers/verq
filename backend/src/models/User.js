const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  // Common fields for both auth methods
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  photoURL: {
    type: String,
    default: 'https://www.gravatar.com/avatar/?d=mp'
  },
  // Firebase specific fields
  uid: {
    type: String,
    sparse: true,
    unique: true
  },
  // JWT specific fields
  password: {
    type: String,
    select: false, // Don't include password in queries by default
    minlength: [8, 'Password must be at least 8 characters long'],
    validate: {
      validator: function(password) {
        // Only require password for JWT users (no uid)
        return this.uid || password.length >= 8;
      },
      message: 'Password is required for email/password login'
    }
  },
  authMethod: {
    type: String,
    required: true,
    enum: ['jwt', 'firebase'],
    default: 'jwt'
  },
  // Common user data
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Hash password before saving (only for JWT users)
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new) and if it's a JWT user
  if (!this.isModified('password') || this.authMethod === 'firebase') return next();
  
  try {
    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if password is correct (for JWT users)
userSchema.methods.correctPassword = async function(candidatePassword) {
  if (this.authMethod === 'firebase') return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = Date.now();
  return this.save();
};

// Create indexes (removed duplicate declarations)
userSchema.index({ email: 1 });
userSchema.index({ uid: 1 }, { sparse: true });

const User = mongoose.model('User', userSchema);

module.exports = User; 