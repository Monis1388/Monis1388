"use client";
import React, { useEffect, useState, use } from 'react';
import api, { BACKEND_URL } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Package,
    Truck,
    Calendar,
    CheckCircle2,
    ArrowLeft,
    ShoppingBag,
    ChevronDown,
    ChevronUp,
    MapPin,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function OrderTrackingPage({ params }: PageProps) {
    const { id: orderId } = use(params);
    const { user } = useAuth();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [tracking, setTracking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [stages, setStages] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        if (!user) {
            router.push('/login');
        } else {
            fetchOrderData();
            // Client-side only date calculation
            setStages([
                { key: 'Confirmed', label: 'Order Confirmed', icon: Package },
                { key: 'Shipped', label: 'Shipped', icon: Truck },
                { key: 'Delivery', label: `Delivery by ${new Date(new Date().setDate(new Date().getDate() + 5)).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`, icon: Calendar },
            ]);
        }
    }, [user, router, orderId]);

    const fetchOrderData = async () => {
        try {
            setLoading(true);
            const { data: orderData } = await api.get(`/orders/${orderId}`);
            setOrder(orderData);

            if (orderData.trackingId) {
                try {
                    const { data: trackingData } = await api.get(`/orders/${orderId}/track`);
                    setTracking(trackingData);
                } catch (err) {
                    console.error('Error fetching tracking data', err);
                }
            }
        } catch (error) {
            console.error('Error fetching order', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full"
            />
        </div>
    );

    if (!order) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF] p-6 text-center">
            <div>
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">Order not found</h1>
                <Link href="/orders" className="text-blue-600 hover:underline mt-4 block">Back to My Orders</Link>
            </div>
        </div>
    );

    if (!mounted) return null;

    // Determine current stage
    let currentStageIndex = 0; // Confirmed
    if (order.orderStatus === 'Shipped' || (tracking && tracking.packages && tracking.packages[0]?.status?.status)) {
        currentStageIndex = 1;
    }
    if (order.isDelivered || order.orderStatus === 'Delivered' || (tracking && tracking.packages && tracking.packages[0]?.status?.status === 'Delivered')) {
        currentStageIndex = 2;
    }

    const fadeInVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const progressLineScale = (currentStageIndex / (stages.length - 1)) * 100;

    return (
        <div className="min-h-screen bg-[#F0F2F5] pb-20">
            {/* Header Section */}
            <header className="bg-white shadow-sm py-4 px-6 mb-6">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800 tracking-tight">Track Your Package</h1>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <AnimatePresence>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInVariants}
                        className="space-y-6"
                    >
                        {/* Order Confirmation Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 md:p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Success! We've received your order</p>
                                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</h2>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-center">
                                        <p className="text-[10px] uppercase font-bold text-blue-100">Expected Delivery</p>
                                        <p className="font-bold text-sm">March 15, 2026</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tracking Progress Section */}
                            <div className="p-6 md:p-10">
                                <div className="relative mb-12">
                                    {/* Progress Background Line */}
                                    <div className="absolute top-1/2 left-0 w-full h-[3px] bg-gray-100 -translate-y-1/2 z-0" />
                                    {/* Active Progress Line */}
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressLineScale}%` }}
                                        transition={{ duration: 1.5, ease: "easeInOut" }}
                                        className="absolute top-1/2 left-0 h-[3px] bg-green-500 -translate-y-1/2 z-0 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                                    />

                                    <div className="flex justify-between items-center relative z-10">
                                        {stages.map((stage, idx) => {
                                            const Icon = stage.icon;
                                            const isActive = idx <= currentStageIndex;
                                            const isFuture = idx > currentStageIndex;

                                            return (
                                                <div key={idx} className="flex flex-col items-center group">
                                                    <motion.div
                                                        initial={{ scale: 0.8 }}
                                                        animate={{ scale: isActive ? 1.1 : 1 }}
                                                        className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-green-500 text-white shadow-xl shadow-green-200' : 'bg-white border-2 border-gray-100 text-gray-300'
                                                            }`}
                                                    >
                                                        <Icon className="w-5 h-5 md:w-7 md:h-7" />
                                                    </motion.div>
                                                    <div className="absolute top-16 md:top-20 text-center">
                                                        <p className={`text-[10px] md:text-xs font-black uppercase tracking-widest whitespace-nowrap ${isActive ? 'text-gray-900' : 'text-gray-400'
                                                            }`}>
                                                            {stage.label}
                                                        </p>
                                                        {isActive && idx === currentStageIndex && (
                                                            <div className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[8px] font-bold mt-1 inline-block animate-pulse uppercase">Current</div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Delhivery Real-time Status Details */}
                                {tracking && tracking.packages && tracking.packages.length > 0 && (
                                    <div className="mt-20 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Latest Update from Delhivery</p>
                                            <p className="text-sm font-bold text-gray-800">
                                                {tracking.packages[0].status?.status || 'In Transit'}
                                                <span className="text-gray-400 font-medium ml-2">— {tracking.packages[0].status?.location || 'Processing Center'}</span>
                                            </p>
                                            <p className="text-[11px] text-gray-500 mt-1 italic italic">Waybill: {order.trackingId}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Details Accordion */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                        <ShoppingBag className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-gray-800">Order Summary</span>
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px] text-gray-500 uppercase font-black">{order.orderItems.length} ITEMS</span>
                                </div>
                                {showDetails ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                            </button>

                            <AnimatePresence>
                                {showDetails && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden border-t border-gray-50"
                                    >
                                        <div className="p-6 space-y-6">
                                            {order.orderItems.map((item: any, i: number) => (
                                                <div key={i} className="flex gap-4 items-center">
                                                    <div className="w-16 h-16 rounded-xl bg-gray-50 p-2 border border-gray-100 overflow-hidden shrink-0">
                                                        <img
                                                            src={item.image?.startsWith('/uploads/') ? `${BACKEND_URL}${item.image}` : item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                                                        <p className="text-xs text-gray-500 mt-1">Qty: {item.qty}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-black text-gray-900">₹{item.price.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="pt-6 border-t border-gray-50 space-y-2">
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>Subtotal</span>
                                                    <span>₹{order.itemsPrice.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>Shipping</span>
                                                    <span>₹{order.shippingPrice.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-50 mt-2">
                                                    <span>Order Total</span>
                                                    <span>₹{order.totalPrice.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer Action */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                            <Link
                                href="/orders"
                                className="px-10 py-4 bg-white border-2 border-gray-100 rounded-2xl font-black uppercase tracking-widest text-[11px] text-gray-700 hover:border-blue-200 hover:text-blue-600 transition-all text-center"
                            >
                                View My Orders
                            </Link>
                            <Link
                                href="/shop"
                                className="px-10 py-4 bg-[#1A1A2E] rounded-2xl font-black uppercase tracking-widest text-[11px] text-white hover:bg-black transition-all shadow-xl shadow-indigo-200 text-center"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
