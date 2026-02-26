"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    MapPin, CreditCard, ShoppingBag, ArrowLeft,
    Truck, ShieldCheck, Wallet, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function Checkout() {
    const router = useRouter();
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [address, setAddress] = useState({
        address: '', city: '', postalCode: '', country: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [isProcessing, setIsProcessing] = useState(false);
    const [serviceability, setServiceability] = useState<{ status: string; message: string } | null>(null);

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
            // Adjust based on actual Delhivery API response
            if (data.status || data.delivery_details) {
                setServiceability({ status: 'success', message: 'Eligible for Express Delivery' });
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

    const subtotal = cartItems.reduce((acc: any, item: any) => acc + item.qty * item.price, 0);
    const shippingPrice = subtotal > 1000 ? 0 : 50;
    const taxPrice = Number((0.18 * subtotal).toFixed(2));
    const totalPrice = Number((subtotal + shippingPrice + taxPrice).toFixed(2));

    const placeOrderHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const orderData = {
                orderItems: cartItems.map((item: any) => ({
                    product: item.product._id,
                    name: item.name || item.product.name,
                    image: item.image || item.product.image,
                    price: item.price,
                    qty: item.qty
                })),
                shippingAddress: address,
                paymentMethod,
                itemsPrice: subtotal,
                shippingPrice,
                taxPrice,
                totalPrice
            };

            const { data } = await api.post('/orders', orderData);

            if (data) {
                alert('Order Placed Successfully!');
                router.push(`/profile`);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to place order');
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#FBFBFB] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex flex-col">
                        <Link href="/cart" className="text-[10px] font-black uppercase text-gray-400 hover:text-primary mb-2 flex items-center gap-2 transition-colors">
                            <ArrowLeft className="w-3 h-3" /> Back to Cart
                        </Link>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Complete Order</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Side: Shipping & Payment */}
                    <div className="lg:col-span-7 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100"
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">Delivery Details</h2>
                            </div>

                            <form id="checkout-form" onSubmit={placeOrderHandler} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Street Address</label>
                                    <input required type="text" className="input-modern" placeholder="House No, Street Name, Area" value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">City</label>
                                        <input required type="text" className="input-modern" placeholder="Your City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Pincode</label>
                                        <input required type="text" className="input-modern" placeholder="000000" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
                                        {serviceability && (
                                            <p className={`text-[10px] font-bold mt-1 ml-1 ${serviceability.status === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {serviceability.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Country / Region</label>
                                    <input required type="text" className="input-modern" placeholder="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
                                </div>

                                <div className="pt-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                            <Wallet className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">Payment Selection</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div
                                            onClick={() => setPaymentMethod('COD')}
                                            className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-black bg-black text-white' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}
                                        >
                                            <div className="flex flex-col gap-4">
                                                <Wallet className={`w-8 h-8 ${paymentMethod === 'COD' ? 'text-white' : 'text-gray-400'}`} />
                                                <div>
                                                    <p className="font-black uppercase tracking-widest text-[10px]">Method</p>
                                                    <p className="text-lg font-black italic uppercase tracking-tighter">Cash On Delivery</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => setPaymentMethod('Stripe')}
                                            className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${paymentMethod === 'Stripe' ? 'border-black bg-black text-white' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}
                                        >
                                            <div className="flex flex-col gap-4">
                                                <CreditCard className={`w-8 h-8 ${paymentMethod === 'Stripe' ? 'text-white' : 'text-gray-400'}`} />
                                                <div>
                                                    <p className="font-black uppercase tracking-widest text-[10px]">Method</p>
                                                    <p className="text-lg font-black italic uppercase tracking-tighter">Secure Card / UPI</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-black text-white rounded-[40px] p-8 md:p-10 shadow-3xl shadow-black/20 sticky top-24"
                        >
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center justify-between">
                                Bag Inventory
                                <span className="bg-white/10 px-4 py-1 rounded-full text-[10px] italic tracking-widest">{cartItems.length} ITEMS</span>
                            </h2>

                            <div className="space-y-6 mb-10 max-h-[40vh] overflow-y-auto pr-4 no-scrollbar">
                                {cartItems.map((item: any) => (
                                    <div key={item._id} className="flex gap-4">
                                        <div className="w-20 h-20 rounded-2xl bg-white/5 p-1 border border-white/10 overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image?.startsWith('/uploads/') ? `http://localhost:5001${item.image}` : item.image}
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-black uppercase tracking-tighter leading-tight mb-1">{item.name || item.product.name}</p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">QTY: {item.qty}</p>
                                                <p className="text-sm font-black italic">₹{(item.price * item.qty).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 border-t border-white/10 pt-8">
                                <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                                    <span>Subtotal</span>
                                    <span className="text-white">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                                    <span>Logistics</span>
                                    <span className="text-white">₹{shippingPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                                    <span>Service Tax (18%)</span>
                                    <span className="text-white">₹{taxPrice.toLocaleString()}</span>
                                </div>

                                <div className="h-px bg-white/10 my-4" />

                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-1">Grand Total</span>
                                        <span className="text-4xl font-black italic uppercase tracking-tighter">₹{totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[8px] font-black uppercase text-gray-400 mb-2">
                                        <ShieldCheck className="w-3 h-3 text-emerald-500" /> Secure SSL
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={isProcessing || cartItems.length === 0}
                                className="w-full h-20 bg-emerald-500 text-white rounded-[24px] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-400 transition-all mt-10 shadow-2xl shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isProcessing ? "Verifying Transaction..." : <><ShoppingBag className="w-4 h-4" /> Authenticate & Place Order</>}
                            </button>

                            <div className="mt-8 flex items-center justify-center gap-6">
                                <Truck className="w-5 h-5 text-gray-600" />
                                <div className="w-px h-4 bg-white/10" />
                                <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Global Express Delivery</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .input-modern {
                    width: 100%;
                    padding: 1.25rem 1.5rem;
                    background-color: #F9FAFB;
                    border: 1px solid #F3F4F6;
                    border-radius: 1.5rem;
                    outline: none;
                    font-size: 0.875rem;
                    font-weight: 700;
                    transition: all 0.2s;
                    color: #111827;
                }
                .input-modern:focus {
                    background-color: white;
                    border-color: #000;
                    box-shadow: 0 0 0 4px rgba(0,0,0,0.03);
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
