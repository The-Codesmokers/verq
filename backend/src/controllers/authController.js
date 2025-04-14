const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.register = async (req, res) => {
  try {
    const { displayName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use'
      });
    }

    // Create new user
    const newUser = await User.create({
      displayName,
      email,
      password,
      authMethod: 'jwt',
      isEmailVerified: false
    });

    // Update last login
    await newUser.updateLastLogin();

    createSendToken(newUser, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Registration failed'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    // Get token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User no longer exists'
      });
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { uid, email, name, photoURL } = req.body;

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email },
        { googleId: uid }
      ]
    });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        displayName: name,
        email,
        authMethod: 'google',
        googleId: uid,
        photoURL,
        isEmailVerified: true
      });
    } else if (user.authMethod !== 'google') {
      // If user exists but with different auth method
      return res.status(400).json({
        status: 'error',
        message: 'Email already registered with different authentication method'
      });
    } else {
      // Update existing Google user
      user.googleId = uid;
      user.photoURL = photoURL;
      await user.save();
    }

    // Update last login
    await user.updateLastLogin();

    createSendToken(user, 200, res);
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Google authentication failed'
    });
  }
};

exports.githubAuth = async (req, res) => {
  try {
    const { uid, email, name, photoURL } = req.body;

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email },
        { githubId: uid }
      ]
    });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        displayName: name,
        email,
        authMethod: 'github',
        githubId: uid,
        photoURL,
        isEmailVerified: true
      });
    } else if (user.authMethod !== 'github') {
      // If user exists but with different auth method
      return res.status(400).json({
        status: 'error',
        message: 'Email already registered with different authentication method'
      });
    } else {
      // Update existing GitHub user
      user.githubId = uid;
      user.photoURL = photoURL;
      await user.save();
    }

    // Update last login
    await user.updateLastLogin();

    createSendToken(user, 200, res);
  } catch (error) {
    console.error('GitHub authentication error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'GitHub authentication failed'
    });
  }
}; 