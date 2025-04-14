import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GithubAuthProvider
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../config/firebase';

const API_URL = 'http://localhost:3000'; // Updated to match backend port

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

export const register = async (displayName, email, password) => {
    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                displayName,
                email,
                password
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            return data.data.user;
        } else {
            throw new Error('No token received from server');
        }
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            return data.data.user;
        } else {
            throw new Error('No token received from server');
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('token');
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const { user } = result;
        
        const response = await fetch(`${API_URL}/api/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to authenticate with backend');
        }

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            return data.data.user;
        } else {
            throw new Error('No token received from server');
        }
    } catch (error) {
        console.error('Google sign-in error:', error);
        throw error;
    }
};

export const signInWithGitHub = async () => {
    try {
        const result = await signInWithPopup(auth, githubProvider);
        const { user } = result;
        
        // Check if the user exists in our MongoDB database
        const response = await fetch(`${API_URL}/api/auth/github`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.message === 'Email already registered with different authentication method') {
                // Handle the case where the email is registered with a different method
                throw new Error('This email is already registered with a different authentication method. Please use the original method to sign in.');
            }
            throw new Error(errorData.message || 'Failed to authenticate with backend');
        }

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            return data.data.user;
        } else {
            throw new Error('No token received from server');
        }
    } catch (error) {
        console.error('GitHub sign-in error:', error);
        if (error.code === 'auth/account-exists-with-different-credential') {
            throw new Error('This email is already registered with a different authentication method. Please use the original method to sign in.');
        }
        throw error;
    }
};

// Add a function to check if user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
}; 