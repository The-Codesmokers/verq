const admin = require('../config/firebaseadmin');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { config } = require('../config/config');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const authType = req.headers['x-auth-type'];
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error('No token provided in request');
            return res.status(401).json({
                status: 'error',
                message: 'No token provided'
            });
        }

        const token = authHeader.split('Bearer ')[1];
        
        try {
            // Determine auth type from header or token format
            const tokenAuthType = authType || (token.startsWith('eyJ') ? 'jwt' : 'firebase');
            
            if (tokenAuthType === 'firebase') {
                // Verify Firebase token
                console.log('Attempting Firebase token verification');
                const decodedToken = await admin.auth().verifyIdToken(token);
                const user = await User.findOne({ uid: decodedToken.uid });
                if (!user) {
                    console.error('User not found for Firebase UID:', decodedToken.uid);
                    return res.status(401).json({
                        status: 'error',
                        message: 'User not found'
                    });
                }
                console.log('Firebase authentication successful for user:', user._id);
                req.user = user;
                return next();
            } else {
                // Verify JWT token
                console.log('Attempting JWT verification');
                try {
                    const decoded = jwt.verify(token, config.jwt.secret);
                    
                    if (!decoded || !decoded.id) {
                        console.error('Invalid JWT token structure');
                        return res.status(401).json({
                            status: 'error',
                            message: 'Invalid token structure'
                        });
                    }

                    const user = await User.findById(decoded.id);
                    if (!user) {
                        console.error('User not found for JWT token:', decoded.id);
                        return res.status(401).json({
                            status: 'error',
                            message: 'User no longer exists'
                        });
                    }
                    console.log('JWT authentication successful for user:', user._id);
                    req.user = user;
                    return next();
                } catch (jwtError) {
                    console.error('JWT verification failed:', jwtError);
                    // If JWT verification fails, try Firebase as fallback
                    try {
                        console.log('JWT verification failed, attempting Firebase verification');
                        const decodedToken = await admin.auth().verifyIdToken(token);
                        const user = await User.findOne({ uid: decodedToken.uid });
                        if (!user) {
                            throw new Error('User not found');
                        }
                        console.log('Firebase authentication successful as fallback');
                        req.user = user;
                        return next();
                    } catch (firebaseError) {
                        throw jwtError; // Throw original JWT error
                    }
                }
            }
        } catch (error) {
            console.error('Token verification failed:', {
                error: error.message,
                stack: error.stack
            });
            
            // Provide more specific error messages
            let errorMessage = 'Invalid token';
            if (error.name === 'JsonWebTokenError') {
                if (error.message === 'invalid algorithm') {
                    errorMessage = 'Token verification failed: Invalid algorithm';
                } else if (error.message === 'jwt malformed') {
                    errorMessage = 'Token verification failed: Malformed token';
                } else if (error.message === 'invalid signature') {
                    errorMessage = 'Token verification failed: Invalid signature';
                }
            } else if (error.name === 'TokenExpiredError') {
                errorMessage = 'Token has expired';
            }
            
            return res.status(401).json({
                status: 'error',
                message: errorMessage
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', {
            error: error.message,
            stack: error.stack
        });
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

module.exports = authMiddleware; 