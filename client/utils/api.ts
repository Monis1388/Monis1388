import axios from 'axios';

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/$/, '') : 'http://localhost:5001';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to include token
api.interceptors.request.use(
    (config) => {
        const userInfo = typeof window !== 'undefined' ? localStorage.getItem('userInfo') : null;
        if (userInfo) {
            try {
                const { token } = JSON.parse(userInfo);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Error parsing userInfo from localStorage', error);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add interceptor to handle 401 logout
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('userInfo');
                // Optional: window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
