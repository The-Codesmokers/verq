const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to get headers with authentication
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic fetch function
const fetchData = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(options.includeAuth !== false),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Specific API methods
export const api = {
  // Auth
  login: (credentials) => 
    fetchData('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      includeAuth: false,
    }),

  register: (userData) => 
    fetchData('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      includeAuth: false,
    }),

  // User
  getUserProfile: () => 
    fetchData('/users/profile'),

  updateUserProfile: (userData) => 
    fetchData('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  // Interviews
  getInterviews: () => 
    fetchData('/interviews'),

  getInterviewById: (id) => 
    fetchData(`/interviews/${id}`),

  createInterview: (interviewData) => 
    fetchData('/interviews', {
      method: 'POST',
      body: JSON.stringify(interviewData),
    }),

  updateInterview: (id, interviewData) => 
    fetchData(`/interviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(interviewData),
    }),

  deleteInterview: (id) => 
    fetchData(`/interviews/${id}`, {
      method: 'DELETE',
    }),

  // Generic methods for custom endpoints
  get: (endpoint) => fetchData(endpoint),
  post: (endpoint, data) => 
    fetchData(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: (endpoint, data) => 
    fetchData(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (endpoint) => 
    fetchData(endpoint, {
      method: 'DELETE',
    }),
}; 