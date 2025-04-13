import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut 
} from 'firebase/auth';
import { auth } from '../config/firebase';

const googleProvider = new GoogleAuthProvider();
const API_URL = 'http://localhost:3000'; // Updated to match the backend port

const saveUserToMongoDB = async (user) => {
    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_URL}/api/users/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            }),
            credentials: 'include' // Include cookies if needed
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Network response was not ok' }));
            throw new Error(errorData.message || 'Failed to save user data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving user to MongoDB:', error);
        if (error.message === 'Failed to fetch') {
            console.error('Backend server might not be running or accessible');
        }
        // Don't throw here, we still want to proceed with the sign-in
        return null;
    }
};

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        // Try to save user data to MongoDB but don't block sign-in if it fails
        const savedUser = await saveUserToMongoDB(result.user);
        if (!savedUser) {
            console.warn('User authenticated but data not saved to MongoDB');
        }
        return result.user;
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw new Error(error.message || 'Failed to sign in with Google');
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
        throw new Error(error.message || 'Failed to sign out');
    }
};

export const loginWithEmailPassword = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include' // Important for handling JWT cookies
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();
        // Store the JWT token in localStorage or secure cookie
        localStorage.setItem('token', data.token);
        return data.user;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

// Add a function to check if user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
}; 