"use client";
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, Menu, X, Search, Heart, Camera, ArrowLeft, Glasses, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const isHome = pathname === '/';

    return (
        <header className="flex flex-col bg-white sticky top-0 z-50 animate-in fade-in duration-500">
            {/* Top Bar: User, Delivery & Icons */}
            <div className="container mx-auto px-4 h-16 flex items-center justify-between border-b border-gray-50">
                <div className="flex items-center gap-3">
                    {!isHome ? (
                        <button
                            onClick={() => router.back()}
                            className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-all active:scale-90"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsOpen(true)}
                            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-all active:scale-90"
                        >
                            <User className="w-6 h-6" />
                        </button>
                    )}

                </div>

                <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <Glasses className="w-8 h-8 text-gray-900 group-hover:text-primary transition-all" />
                    <span className="text-[10px] md:text-xs font-black text-gray-900 tracking-[0.3em] uppercase -mt-1 leading-none">
                        Frame & Sunglasses
                    </span>
                </Link>

                <div className="flex items-center gap-5">

                    <Link href="/wishlist">
                        <Heart className="w-6 h-6 text-gray-700 hover:text-red-500 transition-colors" />
                    </Link>
                    <Link href="/cart" className="relative group">
                        <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors" />
                    </Link>
                    <button onClick={() => setIsOpen(!isOpen)} className="p-1">
                        <Menu className="w-7 h-7 text-gray-800" />
                    </button>
                </div>
            </div>

            {/* Middle Bar: Search */}
            <div className="container mx-auto px-4 py-3 border-b border-gray-100">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search or ask a question"
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 pl-12 pr-12 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm font-medium"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 text-gray-400">
                        <Camera className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
                    </div>
                </div>
            </div>

            {/* Profile/Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] transition-all" onClick={() => setIsOpen(false)}>
                    <div
                        className="absolute right-0 top-0 h-full w-full max-w-[360px] bg-[#F5F6FA] flex flex-col shadow-2xl animate-in slide-in-from-right duration-500 overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header: Dark Navy */}
                        <div className="bg-[#000042] text-white p-6 pb-8">
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setIsOpen(false)} className="hover:scale-110 transition-transform">
                                        <ArrowLeft className="w-7 h-7" />
                                    </button>
                                    <span className="text-xl font-black tracking-tight uppercase italic">My Profile</span>
                                </div>
                                <div className="flex items-center gap-5">
                                    <Search className="w-6 h-6 hover:text-primary cursor-pointer" />
                                    <Link href="/wishlist" onClick={() => setIsOpen(false)}><Heart className="w-6 h-6 hover:text-red-500" /></Link>
                                    <Link href="/cart" onClick={() => setIsOpen(false)}><ShoppingCart className="w-6 h-6 hover:text-primary" /></Link>
                                    <button onClick={() => setIsOpen(false)}><Menu className="w-6 h-6" /></button>
                                </div>
                            </div>

                            {/* User Intro Card */}
                            <div className="bg-white rounded-[24px] p-6 flex flex-col items-center border border-gray-100 shadow-xl shadow-black/10">
                                <div className="relative mb-4">
                                    <div className="w-20 h-20 bg-gray-50 border-2 border-[#000042] rounded-full flex items-center justify-center p-1">
                                        <div className="w-full h-full bg-[#000042]/10 rounded-full flex items-center justify-center overflow-hidden">
                                            {user ? (
                                                <span className="text-3xl font-black text-[#000042] uppercase italic">{user.name[0]}</span>
                                            ) : (
                                                <User className="w-10 h-10 text-[#000042]" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-sm"></div>
                                </div>

                                <div className="text-center">
                                    <h2 className="text-[#000042] text-2xl font-black italic tracking-tighter uppercase leading-none mb-1">
                                        Hi {user ? user.name.split(' ')[0] : 'Specsy'}!
                                    </h2>
                                    <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest max-w-[200px] mx-auto leading-tight">
                                        {user ? 'View your orders and exclusive member perks.' : 'Login or Signup to track your orders and get access to exclusive deals.'}
                                    </p>
                                </div>

                                {!user && (
                                    <Link
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="mt-6 w-full bg-[#000042] text-white py-4 rounded-xl font-black uppercase tracking-widest text-[13px] text-center hover:bg-black transition-all shadow-lg active:scale-95"
                                    >
                                        Login/Signup
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Body: Action Grid */}
                        <div className="flex-1 p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <Link
                                    href="/orders"
                                    onClick={() => setIsOpen(false)}
                                    className="bg-white p-6 rounded-[24px] flex flex-col items-center justify-center gap-3 border border-white shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group"
                                >
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <ShoppingCart className="w-6 h-6 text-[#000042] group-hover:text-primary transition-colors" />
                                    </div>
                                    <span className="text-[#000042] font-black uppercase tracking-widest text-xs italic">Orders</span>
                                </Link>

                                <Link
                                    href="/wishlist"
                                    onClick={() => setIsOpen(false)}
                                    className="bg-white p-6 rounded-[24px] flex flex-col items-center justify-center gap-3 border border-white shadow-sm hover:shadow-xl hover:border-red-500/20 transition-all group"
                                >
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-red-50 transition-colors">
                                        <Heart className="w-6 h-6 text-[#000042] group-hover:text-red-500 transition-colors" />
                                    </div>
                                    <span className="text-[#000042] font-black uppercase tracking-widest text-xs italic">Wishlist</span>
                                </Link>
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-white shadow-sm space-y-4">
                                <Link href="/shop" onClick={() => setIsOpen(false)} className="flex items-center justify-between text-[#000042] font-bold uppercase tracking-widest text-[11px] group">
                                    <span>Shop Collections</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <div className="h-[1px] bg-gray-50 w-full"></div>
                                <Link href="/contact" onClick={() => setIsOpen(false)} className="flex items-center justify-between text-[#000042] font-bold uppercase tracking-widest text-[11px] group">
                                    <span>Support Center</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                {user?.role === 'admin' && (
                                    <>
                                        <div className="h-[1px] bg-gray-50 w-full"></div>
                                        <Link href="/admin/dashboard" onClick={() => setIsOpen(false)} className="flex items-center justify-between text-purple-600 font-black uppercase tracking-widest text-[11px] group">
                                            <span>Admin Console</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </>
                                )}
                                {user && (
                                    <>
                                        <div className="h-[1px] bg-gray-50 w-full"></div>
                                        <button
                                            onClick={() => { logout(); setIsOpen(false); }}
                                            className="flex items-center justify-between w-full text-red-500 font-black uppercase tracking-widest text-[11px] group"
                                        >
                                            <span>Secure Logout</span>
                                            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Footer: Legal */}
                        <div className="p-8 text-center bg-white/50 border-t border-white">
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] italic">Frame & Sunglasses © 2026</p>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
