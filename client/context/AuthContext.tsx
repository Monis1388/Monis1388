"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useRouter } from 'next/navigation';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
    savedPrescriptions?: string[];
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    sendOTP: (phone: string) => Promise<string | undefined>;
    verifyOTP: (phone: string, otp: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            console.log('Logging in...');
            const { data } = await api.post('/users/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            router.push('/');
        } catch (error: any) {
            console.error("Login Check failed", error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            const { data } = await api.post('/users/register', { name, email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            router.push('/');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        router.push('/login');
    };

    const sendOTP = async (phone: string) => {
        try {
            const { data } = await api.post('/users/send-otp', { phone });
            // For development testing, we can return the OTP
            return data.devOtp;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to send OTP');
        }
    };

    const verifyOTP = async (phone: string, otp: string) => {
        try {
            const { data } = await api.post('/users/verify-otp', { phone, otp });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            router.push('/');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'OTP verification failed');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, sendOTP, verifyOTP }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
