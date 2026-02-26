"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag, Trash2, ArrowLeft, Plus,
    Minus, ChevronRight, Sparkles, ShieldCheck
} from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const { data } = await api.get('users/cart');
            setCartItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateQty = async (id: string, qty: number) => {
        if (qty < 1) return;
        try {
            await api.post('users/cart', { productId: id, qty });
            fetchCart();
        } catch (error) {
            console.error(error);
        }
    }

    const removeFromCart = async (id: string) => {
        try {
            await api.delete(`users/cart/${id}`);
            fetchCart();
        } catch (error) {
            console.error(error);
        }
    }

    const subtotal = cartItems.reduce((acc, item: any) => acc + (item.product ? item.qty * item.price : 0), 0);
    const itemCount = cartItems.reduce((acc, item: any) => acc + item.qty, 0);

    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 mb-2">Unauthorized Access</h1>
                <p className="text-gray-400 font-bold mb-8 italic">Please authenticate to view your curated collection.</p>
                <Link href="/login" className="bg-black text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all shadow-xl shadow-black/10">
                    Login to Proceed
                </Link>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBFBFB] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex flex-col">
                        <Link href="/shop" className="text-[10px] font-black uppercase text-gray-400 hover:text-primary mb-2 flex items-center gap-2 transition-colors">
                            <ArrowLeft className="w-3 h-3" /> Continue Shopping
                        </Link>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Your Curated Bag</h1>
                    </div>
                </div>

                {cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[40px] p-20 flex flex-col items-center text-center border border-gray-100 shadow-2xl shadow-gray-200/50"
                    >
                        <ShoppingBag className="w-20 h-20 text-gray-100 mb-6" />
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 mb-2">Bag is empty</h2>
                        <p className="text-gray-400 font-bold mb-8 uppercase text-[10px] tracking-widest">Explore our latest optical collections</p>
                        <Link href="/shop" className="bg-black text-white h-16 px-12 rounded-[24px] font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-3 hover:bg-gray-800 transition-all active:scale-95 shadow-2xl shadow-black/20">
                            Discover Eyewear <ChevronRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Cart Items List */}
                        <div className="lg:col-span-8 space-y-6">
                            <AnimatePresence mode="popLayout">
                                {cartItems.map((item: any, idx: number) => {
                                    if (!item.product) return null;
                                    return (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: idx * 0.1 }}
                                            key={item.product._id}
                                            className="bg-white rounded-[32px] p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/50 group"
                                        >
                                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                                {/* Thumbnail */}
                                                <div className="w-full md:w-48 aspect-[4/3] rounded-[24px] bg-gray-50 p-2 border border-gray-100 flex items-center justify-center overflow-hidden">
                                                    <img
                                                        src={item.image?.startsWith('/uploads/') ? `http://localhost:5001${item.image}` : (item.image || item.product.image || '/placeholder.png')}
                                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                        alt={item.name}
                                                    />
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 space-y-4 text-center md:text-left">
                                                    <div>
                                                        <Link href={`/product/${item.product._id}`} className="text-xl font-black italic uppercase tracking-tighter text-gray-900 hover:text-blue-600 transition-colors">
                                                            {item.name || item.product.name}
                                                        </Link>
                                                        <p className="text-2xl font-black text-blue-600 mt-1">₹{item.price.toLocaleString()}</p>
                                                    </div>

                                                    {item.lensPower && (
                                                        <div className="inline-block bg-blue-50/50 p-4 rounded-3xl border border-blue-100/50 text-left">
                                                            <div className="flex items-center gap-1.5 mb-2">
                                                                <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest px-2 py-0.5 bg-blue-100 rounded-full">{item.lensPower.lensType}</span>
                                                                <div className="h-1 w-1 rounded-full bg-blue-200" />
                                                                <span className="text-[10px] font-black uppercase text-gray-400">Optics Precision</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                                                <div className="text-[10px] flex items-center gap-2">
                                                                    <span className="font-black text-gray-400 uppercase">OD:</span>
                                                                    <span className="font-black italic text-gray-900">{item.lensPower.od.sph || '0'} / {item.lensPower.od.cyl || '0'} / {item.lensPower.od.axis || '0'}</span>
                                                                </div>
                                                                <div className="text-[10px] flex items-center gap-2">
                                                                    <span className="font-black text-gray-400 uppercase">OS:</span>
                                                                    <span className="font-black italic text-gray-900">{item.lensPower.os.sph || '0'} / {item.lensPower.os.cyl || '0'} / {item.lensPower.os.axis || '0'}</span>
                                                                </div>
                                                                {item.lensPower.pd && (
                                                                    <div className="text-[10px] col-span-2 flex items-center gap-2 border-t border-blue-100/50 pt-2 mt-1">
                                                                        <span className="font-black text-gray-400 uppercase">Pupillary Distance:</span>
                                                                        <span className="font-black italic text-gray-900">{item.lensPower.pd}mm</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-row md:flex-col items-center gap-6">
                                                    <div className="flex items-center bg-gray-50 p-2 rounded-2xl gap-2 border border-gray-100">
                                                        <button
                                                            onClick={() => updateQty(item.product._id, item.qty - 1)}
                                                            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 hover:text-black hover:shadow-sm transition-all"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-8 text-center font-black text-sm italic">{item.qty}</span>
                                                        <button
                                                            onClick={() => updateQty(item.product._id, item.qty + 1)}
                                                            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 hover:text-black hover:shadow-sm transition-all"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.product._id)}
                                                        className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all group/trash"
                                                    >
                                                        <Trash2 className="w-5 h-5 group-hover/trash:scale-110 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary (The Vault Aesthetic) */}
                        <div className="lg:col-span-4">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-black text-white rounded-[40px] p-8 md:p-10 shadow-3xl shadow-black/20 sticky top-24"
                            >
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center justify-between">
                                    Summary
                                    <Sparkles className="w-5 h-5 text-emerald-400" />
                                </h2>

                                <div className="space-y-6 border-b border-white/10 pb-8 mb-8">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                                        <span>Total Units</span>
                                        <span className="text-white">{itemCount} items</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                                        <span>Logistics</span>
                                        <span className="text-emerald-500">Calculated at Checkout</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                                        <span>Service Tax</span>
                                        <span className="text-white">Inclusive</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 mb-10">
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Est. Subtotal</span>
                                    <span className="text-5xl font-black italic uppercase tracking-tighter">₹{subtotal.toLocaleString()}</span>
                                </div>

                                <div className="space-y-4">
                                    <Link href="/checkout" className="group block">
                                        <button className="w-full h-20 bg-white text-black rounded-[24px] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-400 hover:text-white transition-all shadow-2xl shadow-white/5 active:scale-[0.98] flex items-center justify-center gap-3">
                                            Checkout Now <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </Link>

                                    <div className="flex items-center justify-center gap-3 py-4">
                                        <ShieldCheck className="w-4 h-4 text-gray-500" />
                                        <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Encrypted Checkout Guaranteed</span>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Member Benefit</p>
                                    <p className="text-xs font-bold leading-relaxed">Free premium hard-shell case & cleaning kit included with this order.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
