"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, CreditCard, ShoppingBag, ArrowLeft,
    Truck, ShieldCheck, Wallet, ChevronRight,
    Sparkles, Info, Package, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import api, { BACKEND_URL } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function Checkout() {
    const router = useRouter();
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [address, setAddress] = useState({
        address: '', city: '', state: '', postalCode: '', country: 'India'
    });
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [isProcessing, setIsProcessing] = useState(false);
    const [serviceability, setServiceability] = useState<{ status: string; message: string } | null>(null);

    // COD is now available for ALL orders (Frame Only and Lens orders).
    const hasLens = cartItems.some((item: any) =>
        item.lensPower && item.lensPower.lensType && item.lensPower.lensType !== 'Default'
    );

    useEffect(() => {
        // Limitation removed: COD allowed for lenses
    }, [hasLens, paymentMethod]);

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);

    useEffect(() => {
        if (address.postalCode.length === 6) {
            checkPinServiceability(address.postalCode);
        } else {
            setServiceability(null);
        }
    }, [address.postalCode]);

    const checkPinServiceability = async (pincode: string) => {
        try {
            const { data } = await api.get(`/orders/serviceability/${pincode}`);

            if (data.status) {
                setServiceability({
                    status: 'success',
                    message: data.source === 'Delhivery' ? 'Express Delivery Eligible' : 'Standard Delivery Eligible'
                });

                // Auto-populate City & State from Multi-Source Data
                setAddress(prev => ({
                    ...prev,
                    city: data.city || prev.city,
                    state: data.state || prev.state,
                }));
            } else {
                setServiceability({ status: 'error', message: 'Pincode not serviceable' });
            }
        } catch (error) {
            setServiceability({ status: 'error', message: 'Serviceability check failed' });
        }
    };

    const fetchCart = async () => {
        try {
            const { data } = await api.get('/users/cart');
            setCartItems(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRazorpayPayment = async () => {
        try {
            const { data: order } = await api.post('/orders/razorpay', { amount: totalPrice });

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
                amount: order.amount,
                currency: order.currency,
                name: "Patel Optical",
                description: "Order Checkout",
                order_id: order.id,
                handler: async (response: any) => {
                    await placeOrderHandler(null, response);
                },
                prefill: {
                    name: user?.name || 'Guest Customer',
                    email: user?.email || '',
                },
                theme: {
                    color: "#4DA6FF",
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            alert("Payment Gateway Error");
        }
    };

    const subtotal = cartItems.reduce((acc: any, item: any) => acc + item.qty * item.price, 0);
    const shippingPrice = 0; // Removed as per request
    const totalPrice = Number(subtotal.toFixed(2)); // Only product price

    const placeOrderHandler = async (e: React.FormEvent | null, razorpayResponse?: any) => {
        if (e) e.preventDefault();

        if (paymentMethod === 'Razorpay' && !razorpayResponse) {
            handleRazorpayPayment();
            return;
        }

        setIsProcessing(true);
        try {
            const orderData = {
                orderItems: cartItems.map((item: any) => ({
                    product: item.product._id,
                    name: item.name || item.product.name,
                    image: item.image || item.product.image,
                    price: item.price,
                    qty: item.qty,
                    lensStats: item.lensPower
                })),
                shippingAddress: address,
                paymentMethod,
                itemsPrice: subtotal,
                taxPrice: 0,
                shippingPrice,
                totalPrice,
                paymentResult: razorpayResponse ? {
                    id: razorpayResponse.razorpay_payment_id,
                    status: 'paid',
                    update_time: String(Date.now()),
                    email_address: user?.email
                } : undefined,
                isPaid: !!razorpayResponse,
                paidAt: razorpayResponse ? new Date() : undefined
            };

            const { data } = await api.post('/orders', orderData);

            if (data) {
                router.push(`/orders/${data._id}`);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to place order');
        } finally {
            setIsProcessing(false);
        }
    }

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

    return (
        <div className="min-h-screen bg-[#F8FAFF] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
                >
                    <div className="flex flex-col">
                        <Link href="/cart" className="text-[11px] font-black uppercase text-blue-400 hover:text-blue-600 mb-2 flex items-center gap-2 transition-colors tracking-widest">
                            <ArrowLeft className="w-3.5 h-3.5" /> Secure Bag
                        </Link>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#1A1A2E] leading-none">Checkout</h1>
                    </div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                >
                    {/* Left Side: Shipping & Payment */}
                    <div className="lg:col-span-7 space-y-8">
                        <motion.div variants={itemVariants} className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_15px_50px_rgba(0,102,255,0.04)] border border-[#E0EAF5] antigravity-card">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-[#EAF4FF] rounded-2xl flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-[#4DA6FF]" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-[#1A1A2E]">Delivery Details</h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Where should we ship your optics?</p>
                                </div>
                            </div>

                            <form id="checkout-form" onSubmit={placeOrderHandler} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[11px] font-black uppercase text-[#1A1A2E] tracking-widest ml-1">Street Address</label>
                                    <input required type="text" className="input-premium" placeholder="House No, Street Name, Area" value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-[#1A1A2E] tracking-widest ml-1">Pincode</label>
                                    <div className="relative">
                                        <input required type="text" className="input-premium" placeholder="000000" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
                                        <AnimatePresence>
                                            {serviceability && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`absolute -bottom-6 right-2 text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 ${serviceability.status === 'success' ? (serviceability.message.includes('Standard') ? 'text-amber-500' : 'text-emerald-500') : 'text-red-500'}`}
                                                >
                                                    {serviceability.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                                                    {serviceability.message}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-[#1A1A2E] tracking-widest ml-1">City</label>
                                    <input required type="text" className="input-premium" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-[#1A1A2E] tracking-widest ml-1">State</label>
                                    <input required type="text" className="input-premium" placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                                </div>

                                <div className="space-y-2 md:col-span-1">
                                    <label className="text-[11px] font-black uppercase text-[#1A1A2E] tracking-widest ml-1">Country</label>
                                    <input required type="text" className="input-premium" placeholder="India" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
                                </div>
                            </form>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_15px_50px_rgba(0,102,255,0.04)] border border-[#E0EAF5]">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-[#EAF4FF] rounded-2xl flex items-center justify-center">
                                    <Wallet className="w-6 h-6 text-[#4DA6FF]" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-[#1A1A2E]">Payment Selection</h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select your preferred gateway</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div
                                    onClick={() => setPaymentMethod('COD')}
                                    className={`p-6 rounded-3xl border-2 transition-all relative overflow-hidden group ${paymentMethod === 'COD'
                                        ? 'border-blue-500 bg-blue-50 text-[#1A1A2E]'
                                        : 'border-gray-50 bg-gray-50 hover:border-blue-300/30 cursor-pointer'
                                        }`}
                                >
                                    {paymentMethod === 'COD' && (
                                        <div className="absolute top-4 right-4 animate-in zoom-in-50">
                                            <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-4">
                                        <Wallet className={`w-8 h-8 transition-colors ${paymentMethod === 'COD' ? 'text-blue-500' : 'text-gray-300'}`} />
                                        <div>
                                            <p className="font-black uppercase tracking-widest text-[9px] opacity-60">Handover</p>
                                            <p className="text-lg font-black italic uppercase tracking-tighter">Cash On Delivery</p>
                                            <p className="text-[9px] font-bold text-emerald-500 uppercase mt-1 italic tracking-tight">Available for Lenses</p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setPaymentMethod('Razorpay')}
                                    className={`p-6 rounded-3xl border-2 cursor-pointer transition-all relative overflow-hidden group ${paymentMethod === 'Razorpay' ? 'border-[#4DA6FF] bg-[#EAF4FF] text-[#1A1A2E]' : 'border-gray-50 bg-gray-50 hover:border-[#4DA6FF]/30'}`}
                                >
                                    {paymentMethod === 'Razorpay' && <div className="absolute top-4 right-4"><CheckCircle2 className="w-5 h-5 text-[#4DA6FF]" /></div>}
                                    <div className="flex flex-col gap-4">
                                        <CreditCard className={`w-8 h-8 transition-colors ${paymentMethod === 'Razorpay' ? 'text-[#4DA6FF]' : 'text-gray-300'}`} />
                                        <div>
                                            <p className="font-black uppercase tracking-widest text-[9px] opacity-60">Digital</p>
                                            <p className="text-lg font-black italic uppercase tracking-tighter">Secure Card / UPI</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="lg:col-span-5">
                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-[40px] p-8 md:p-10 shadow-[0_30px_70px_rgba(0,102,255,0.08)] border border-[#E0EAF5] sticky top-24 overflow-hidden"
                        >
                            {/* Decorative Top Accent */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4DA6FF] to-[#A2D2FF]" />

                            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center justify-between text-[#1A1A2E]">
                                Bag Inventory
                                <span className="bg-[#EAF4FF] text-[#4DA6FF] px-4 py-1.5 rounded-full text-[10px] font-black italic tracking-widest">{cartItems.length} ITEMS</span>
                            </h2>

                            <div className="space-y-6 mb-10 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
                                <AnimatePresence>
                                    {cartItems.map((item: any, idx: number) => (
                                        <motion.div
                                            key={item._id}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="flex gap-4 group"
                                        >
                                            <div className="w-20 h-20 rounded-2xl bg-gray-50 p-1 border border-gray-100 overflow-hidden flex-shrink-0 group-hover:border-[#4DA6FF]/30 transition-colors">
                                                <img
                                                    src={item.image?.startsWith('/uploads/') ? `${BACKEND_URL}${item.image}` : item.image}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                    alt={item.name}
                                                />
                                            </div>
                                            <div className="flex-1 py-1">
                                                <p className="text-[11px] font-black uppercase tracking-tighter text-[#1A1A2E] leading-tight mb-1 line-clamp-2">{item.name || item.product.name}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="bg-gray-100 px-2 py-0.5 rounded text-[9px] font-bold text-gray-500 uppercase tracking-widest">Qty: {item.qty}</div>
                                                    <p className="text-sm font-black italic text-[#4DA6FF]">₹{(item.price * item.qty).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="mt-8 overflow-hidden rounded-[24px]">
                                <div className="bg-gradient-to-r from-[#4DA6FF] to-[#A2D2FF] p-6 text-white">
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">Grand Total</span>
                                            <h3 className="text-5xl font-black italic uppercase tracking-tighter leading-none">₹{totalPrice.toLocaleString()}</h3>
                                        </div>
                                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                            <Sparkles className="w-6 h-6 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <button
                            type="submit"
                            form="checkout-form"
                            disabled={isProcessing || cartItems.length === 0 || serviceability?.status === 'error'}
                            className="w-full h-20 bg-[#1A1A2E] text-white rounded-[24px] font-black uppercase tracking-[0.3em] text-[11px] hover:bg-black transition-all mt-8 shadow-2xl shadow-[#1A1A2E]/20 active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            {/* Button Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                            {isProcessing ? (
                                <span className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Verifying Transaction...
                                </span>
                            ) : (
                                <>Place My Order <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>

                        <div className="mt-8 flex items-center justify-center gap-3 text-emerald-500 font-bold uppercase tracking-widest text-[9px] py-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <ShieldCheck className="w-4 h-4" /> Triple-Layer Encrypted Checkout
                        </div>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
                @keyframes antigravity {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes inputFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
                .antigravity-card {
                    animation: antigravity 6s ease-in-out infinite;
                }
                .input-premium {
                    width: 100%;
                    padding: 1.25rem 1.75rem;
                    background-color: #FFFFFF;
                    border: 2px solid #F3F7FA;
                    border-radius: 1.5rem;
                    outline: none;
                    font-size: 0.95rem;
                    font-weight: 800;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    color: #1A1A2E;
                }
                .input-premium:hover {
                    animation: inputFloat 3s ease-in-out infinite;
                    border-color: #E0EAF5;
                }
                .input-premium:focus {
                    background-color: #FFFFFF;
                    border-color: #4DA6FF;
                    box-shadow: 0 10px 25px rgba(77, 166, 255, 0.1);
                    transform: translateY(-2px);
                    animation: none;
                }
                .input-premium::placeholder {
                    color: #C0C8D0;
                    font-weight: 600;
                    font-style: italic;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #F1F5F9;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #CBD5E1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94A3B8;
                }
            `}</style>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        </div>
    );
}

