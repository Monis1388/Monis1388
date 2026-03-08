"use client";
import React, { useEffect, useState } from 'react';
import api, { BACKEND_URL } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Package, ArrowLeft, ShoppingBag, Clock, CheckCircle2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrdersPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else {
            fetchOrders();
        }
    }, [user, router]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/myorders');
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFF] py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-4xl mx-auto"
            >
                <div className="flex items-center justify-between mb-12">
                    <motion.div variants={itemVariants}>
                        <Link href="/profile" className="text-[11px] font-black uppercase text-blue-400 hover:text-blue-600 mb-2 flex items-center gap-2 transition-colors tracking-widest">
                            <ArrowLeft className="w-3.5 h-3.5" /> Secure Profile
                        </Link>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#1A1A2E] leading-none">Order Repository</h1>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-white px-8 py-4 rounded-[24px] shadow-[0_10px_40px_rgba(0,102,255,0.05)] border border-gray-50 flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Archived</span>
                            <span className="text-lg font-black italic text-[#1A1A2E] leading-none">{orders.length} ITEMS</span>
                        </div>
                    </motion.div>
                </div>

                {orders.length === 0 ? (
                    <motion.div variants={itemVariants} className="bg-white rounded-[48px] p-24 text-center shadow-[0_20px_60px_rgba(0,102,255,0.06)] border border-gray-50">
                        <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 transition-all hover:scale-110">
                            <ShoppingCart className="w-10 h-10 text-gray-200" />
                        </div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-[#1A1A2E] mb-3">Your Bag is Empty</h2>
                        <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-10 max-w-[240px] mx-auto leading-relaxed">Precision optics await. Start your collection today.</p>
                        <Link href="/shop" className="bg-[#1A1A2E] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-black transition-all shadow-xl shadow-[#1A1A2E]/20 active:scale-95">Discover Collection</Link>
                    </motion.div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order: any) => (
                            <motion.div key={order._id} variants={itemVariants} className="bg-white rounded-[40px] p-10 shadow-[0_15px_50px_rgba(0,102,255,0.04)] border border-gray-50 hover:shadow-[0_30px_80px_rgba(0,102,255,0.08)] transition-all group relative overflow-hidden">
                                {/* Decorative Gradient */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-[100px]" />

                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 pb-8 border-b border-gray-50 relative">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-[#1A1A2E] rounded-[22px] flex items-center justify-center shadow-lg shadow-[#1A1A2E]/20">
                                            <Package className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Transaction Verified</div>
                                            <div className="text-xl font-black italic text-[#1A1A2E] uppercase tracking-tighter">ORD-{order._id.substring(order._id.length - 8)}</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex flex-col items-end px-6 py-2 border-r border-gray-100">
                                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Logged On</span>
                                            <span className="text-xs font-black text-[#1A1A2E]">
                                                {new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
                                            </span>
                                        </div>

                                        <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2.5 shadow-sm ${order.orderStatus === 'Delivered' ? 'bg-emerald-500 text-white shadow-emerald-200' :
                                            order.orderStatus === 'Shipped' ? 'bg-[#4DA6FF] text-white shadow-blue-200' :
                                                'bg-[#1A1A2E] text-white shadow-indigo-200'
                                            }`}>
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            {order.orderStatus === 'Processing' ? 'Confirmed' : order.orderStatus}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-8 relative">
                                    <div className="flex -space-x-5">
                                        {order.orderItems.map((item: any, i: number) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ y: -10, scale: 1.1, zIndex: 10 }}
                                                className="w-20 h-20 rounded-[28px] bg-[#F8FAFF] border-[4px] border-white shadow-xl overflow-hidden flex-shrink-0 transition-transform cursor-pointer"
                                            >
                                                <img
                                                    src={item.image?.startsWith('/uploads/') ? `${BACKEND_URL}${item.image}` : item.image}
                                                    className="w-full h-full object-contain p-2"
                                                    alt={item.name}
                                                />
                                            </motion.div>
                                        ))}
                                        {order.orderItems.length > 3 && (
                                            <div className="w-20 h-20 rounded-[28px] bg-[#1A1A2E] border-[4px] border-white shadow-xl flex items-center justify-center text-xs font-black text-white">
                                                +{order.orderItems.length - 3}
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-right flex flex-col items-end">
                                        <div className="mb-4">
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] block mb-1">Total Premium</span>
                                            <span className="text-5xl font-black italic text-[#1A1A2E] uppercase tracking-tighter leading-none">₹{order.totalPrice.toLocaleString()}</span>
                                        </div>

                                        {order.trackingId && (
                                            <Link
                                                href={`/orders/${order._id}`}
                                                className="flex items-center gap-3 bg-[#EAF4FF] text-[#4DA6FF] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#4DA6FF] hover:text-white transition-all border border-[#4DA6FF]/10 shadow-lg shadow-blue-500/5 group/btn"
                                            >
                                                Track Shipment <ArrowLeft className="w-4 h-4 rotate-180 group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
