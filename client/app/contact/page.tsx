'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Phone,
    Mail,
    Clock,
    Send,
    MessageCircle,
    ClipboardList,
    MapPin,
    CheckCircle2,
    Upload,
    FileUp,
    Hash
} from 'lucide-react';
import api from '@/utils/api';

const ContactPage = () => {
    const [formState, setFormState] = useState({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        orderId: '',
        message: ''
    });

    const [prescription, setPrescription] = useState<File | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let prescriptionUrl = '';
            if (prescription) {
                const formData = new FormData();
                formData.append('image', prescription);
                const { data } = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                prescriptionUrl = data;
            }

            await api.post('/contact', {
                ...formState,
                prescription: prescriptionUrl
            });

            setIsSubmitted(true);
            setFormState({ fullName: '', email: '', phone: '', subject: '', orderId: '', message: '' });
            setPrescription(null);
            setTimeout(() => setIsSubmitted(false), 5000);
        } catch (error) {
            console.error('Contact submit error:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPrescription(e.target.files[0]);
        }
    };

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const contactMethods = [
        {
            icon: <Phone className="w-6 h-6" />,
            title: "Phone",
            value: "+91 8788617183",
            link: "tel:+918788617183",
            label: "Customer Support"
        },
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Email",
            value: "support@frameandsunglasses.com",
            link: "mailto:support@frameandsunglasses.com",
            label: "Official Correspondence"
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Working Hours",
            value: "Mon – Sat (10:00 AM – 7:00 PM)",
            link: null,
            label: "Standard Availability"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto py-20 px-6">
            <motion.div {...fadeIn} className="space-y-16">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        At Frame & Sunglasses, your vision and satisfaction are our priority.
                        Feel free to contact us with any questions.
                    </p>
                    <div className="h-1 w-20 bg-primary mx-auto rounded-full mt-6"></div>
                </div>

                {/* Contact Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Contact Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="space-y-6">
                            {contactMethods.map((method, idx) => (
                                method.link ? (
                                    <motion.a
                                        key={idx}
                                        href={method.link}
                                        whileHover={{ x: 10 }}
                                        className="flex items-center gap-5 p-6 bg-white rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                    >
                                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                            {method.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{method.label}</p>
                                            <p className="font-bold text-gray-900 group-hover:text-primary transition-colors break-all">{method.value}</p>
                                        </div>
                                    </motion.a>
                                ) : (
                                    <motion.div
                                        key={idx}
                                        className="flex items-center gap-5 p-6 bg-white rounded-[24px] border border-gray-100 shadow-sm transition-all"
                                    >
                                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                                            {method.icon}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{method.label}</p>
                                            <p className="font-bold text-gray-900">{method.value}</p>
                                        </div>
                                    </motion.div>
                                )
                            ))}
                        </div>

                        {/* Order Support Notice */}
                        <div className="bg-[#000042] text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <ClipboardList className="w-6 h-6 text-white/60" />
                                    <h3 className="text-lg font-black uppercase tracking-tight italic">Order Support</h3>
                                </div>
                                <p className="text-sm text-white/70 leading-relaxed font-bold">
                                    For order tracking or prescription-related queries, please mention:
                                </p>
                                <ul className="space-y-3">
                                    {['Your Order ID', 'Registered Mobile Number', 'Upload prescription copy'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-10 md:p-12 rounded-[40px] border border-gray-100 shadow-xl">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">Send Us a Message</h3>
                            </div>

                            {isSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                                >
                                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h4 className="text-2xl font-black uppercase italic tracking-tighter">Message Received!</h4>
                                    <p className="text-gray-500 font-bold">Our team will respond within 24–48 business hours.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Full Name</label>
                                            <input
                                                required
                                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                                                placeholder="Enter your name"
                                                value={formState.fullName}
                                                onChange={e => setFormState({ ...formState, fullName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                                                placeholder="your@email.com"
                                                value={formState.email}
                                                onChange={e => setFormState({ ...formState, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Phone Number</label>
                                            <input
                                                required
                                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                                                placeholder="+91 XXXXX XXXXX"
                                                value={formState.phone}
                                                onChange={e => setFormState({ ...formState, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Subject</label>
                                            <input
                                                required
                                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                                                placeholder="Product Query / Order Info"
                                                value={formState.subject}
                                                onChange={e => setFormState({ ...formState, subject: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Order ID (Optional)</label>
                                            <div className="relative">
                                                <Hash className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                                <input
                                                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                                                    placeholder="e.g. 12345"
                                                    value={formState.orderId}
                                                    onChange={e => setFormState({ ...formState, orderId: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Upload Prescription (Optional)</label>
                                            <label className="flex items-center gap-3 w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl cursor-pointer hover:bg-gray-100 transition-all group overflow-hidden">
                                                <div className="flex-shrink-0 w-6 h-6 bg-white rounded-lg flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors shadow-sm">
                                                    <Upload className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-sm font-bold text-gray-500 truncate">
                                                    {prescription ? prescription.name : 'Choose file...'}
                                                </span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                    accept="image/*,.pdf"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Message</label>
                                        <textarea
                                            required
                                            rows={5}
                                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-3xl outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold resize-none"
                                            placeholder="How can we help you today?"
                                            value={formState.message}
                                            onChange={e => setFormState({ ...formState, message: e.target.value })}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-16 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-gray-800 transition-all active:scale-[0.98] shadow-xl shadow-black/10 group disabled:opacity-50"
                                    >
                                        {loading ? 'Sending...' : 'Send Message'}
                                        {!loading && <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tagline Section */}
                <div className="pt-20 border-t border-gray-100 text-center space-y-4">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Thank You for Choosing Frame & Sunglasses</p>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">
                        See Better. Look Better. Feel Confident.
                    </h2>
                </div>
            </motion.div>
        </div>
    );
};

export default ContactPage;
