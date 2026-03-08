"use client";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, Lock, KeyRound, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
    const [loginMethod, setLoginMethod] = useState<'email' | 'mobile' | 'admin'>('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, sendOTP, verifyOTP } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (loginMethod === 'email' || loginMethod === 'admin') {
                await login(email, password);
            } else {
                if (!otpSent) {
                    const devOtp = await sendOTP(phone);
                    setOtpSent(true);
                    if (devOtp) {
                        alert(`[DEMO MODE] Your OTP is: ${devOtp}. (In production, this would be an SMS)`);
                        setOtp(devOtp);
                    }
                } else {
                    await verifyOTP(phone, otp);
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-2xl p-8 md:p-10">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-500">Sign in to your Frame & Sunglasses account</p>
                    </div>

                    {/* Login Method Toggle */}
                    <div className="flex p-1 bg-gray-100/50 rounded-2xl mb-8">
                        <button
                            onClick={() => { setLoginMethod('email'); setError(''); setOtpSent(false); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${loginMethod === 'email' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Mail className="w-4 h-4" /> Email
                        </button>
                        <button
                            onClick={() => { setLoginMethod('mobile'); setError(''); setOtpSent(false); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${loginMethod === 'mobile' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Phone className="w-4 h-4" /> Mobile
                        </button>
                        <button
                            onClick={() => { setLoginMethod('admin'); setError(''); setOtpSent(false); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${loginMethod === 'admin' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Lock className="w-4 h-4" /> Admin
                        </button>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-2xl mb-6 text-sm flex items-center gap-2"
                        >
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {(loginMethod === 'email' || loginMethod === 'admin') ? (
                                <motion.div
                                    key="email-form"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                                            {loginMethod === 'admin' ? 'Admin Email' : 'Email Address'}
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                placeholder="admin@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="password"
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {loginMethod === 'admin' && (
                                        <motion.button
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            type="button"
                                            onClick={() => {
                                                setEmail('admin@example.com');
                                                setPassword('password123');
                                            }}
                                            className="w-full py-2 border-2 border-dashed border-purple-200 text-purple-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-purple-50 transition-colors"
                                        >
                                            Quick Admin Login
                                        </motion.button>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="mobile-form"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Mobile Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                placeholder="+91 00000 00000"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                required
                                                disabled={otpSent}
                                            />
                                        </div>
                                    </div>
                                    {otpSent && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Enter OTP</label>
                                            <div className="relative">
                                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    maxLength={6}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none tracking-[0.5em] font-mono text-lg"
                                                    placeholder="000000"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setOtpSent(false)}
                                                className="text-xs text-primary font-semibold mt-2 ml-1 hover:underline"
                                            >
                                                Change Number?
                                            </button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg ${loginMethod === 'admin'
                                ? 'bg-purple-600 text-white shadow-purple-200 hover:bg-purple-700'
                                : 'bg-primary text-primary-foreground shadow-primary/20 hover:opacity-90'
                                } active:scale-95`}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {loginMethod === 'admin' ? 'Admin Sign In' : (loginMethod === 'email' ? 'Sign In' : (otpSent ? 'Verify OTP' : 'Send OTP'))}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>


                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            New Customer? {' '}
                            <Link href="/register" className="text-primary font-bold hover:underline">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Security Note */}
                <div className="mt-8 flex items-center justify-center gap-6 text-gray-400 grayscale opacity-50">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-xs font-medium">Secure Login</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
