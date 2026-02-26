"use client";
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, Menu, X, Search, Heart, Camera, ArrowLeft, Glasses } from 'lucide-react';
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
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                            <User className="w-6 h-6" />
                        </div>
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

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" onClick={() => setIsOpen(false)}>
                    <div className="absolute right-0 top-0 h-full w-[280px] bg-white p-6 shadow-2xl animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex flex-col items-start gap-1">
                                <Glasses className="w-8 h-8 text-primary" />
                                <span className="text-[10px] font-black text-gray-900 tracking-[0.2em] uppercase">Frame & Sunglasses</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="space-y-6">
                            <Link href="/shop" className="block text-lg font-bold text-gray-800" onClick={() => setIsOpen(false)}>Shop All</Link>
                            <Link href="/shop?category=Eyeglasses" className="block text-lg font-bold text-gray-800" onClick={() => setIsOpen(false)}>Eyeglasses</Link>
                            <Link href="/shop?category=Sunglasses" className="block text-lg font-bold text-gray-800" onClick={() => setIsOpen(false)}>Sunglasses</Link>
                            <div className="pt-6 border-t">
                                {user ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-primary font-bold">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold flex items-center gap-2">
                                                    {user.name}
                                                    {user.role === 'admin' && (
                                                        <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Admin</span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        {user.role === 'admin' && (
                                            <Link
                                                href="/admin/dashboard"
                                                className="block w-full text-center py-3 bg-purple-50 text-purple-700 rounded-xl font-black uppercase tracking-tighter text-sm mb-4 border border-purple-100"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Open Admin Panel
                                            </Link>
                                        )}
                                        <button onClick={() => { logout(); setIsOpen(false); }} className="w-full btn btn-outline border-red-100 text-red-500 hover:bg-red-50">Log Out</button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href="/login" className="btn btn-outline" onClick={() => setIsOpen(false)}>Login</Link>
                                        <Link href="/register" className="btn btn-primary" onClick={() => setIsOpen(false)}>Sign Up</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
export default Navbar;
