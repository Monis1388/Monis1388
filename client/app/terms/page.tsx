'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    UserCheck,
    Glasses,
    ClipboardList,
    CreditCard,
    Truck,
    RotateCcw,
    AlertTriangle,
    Copyright,
    Mail,
    Phone,
    MapPin
} from 'lucide-react';

const TermsPage = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const sections = [
        {
            icon: <UserCheck className="w-6 h-6 text-primary" />,
            title: "1. Acceptance of Terms",
            content: [
                "You are at least 18 years old or using the website under supervision of a guardian.",
                "The information you provide is accurate and complete.",
                "You will not misuse the website for illegal or unauthorized activities.",
                "We reserve the right to modify these terms at any time without prior notice."
            ]
        },
        {
            icon: <Glasses className="w-6 h-6 text-primary" />,
            title: "2. Products & Services",
            content: [
                "Frame & Sunglasses offers Prescription Glasses, Zero Power / Blue Light Glasses, Sunglasses, and Frames Only.",
                "All products are subject to availability.",
                "We reserve the right to discontinue or modify products at any time."
            ]
        },
        {
            icon: <ClipboardList className="w-6 h-6 text-primary" />,
            title: "3. Prescription Responsibility",
            content: [
                "Customers are responsible for entering correct prescription details.",
                "We are not liable for incorrect information provided by customers.",
                "Uploaded prescriptions must be valid and issued by a certified eye specialist.",
                "Prescription lenses are customized products and may not be eligible for return unless defective."
            ]
        },
        {
            icon: <CreditCard className="w-6 h-6 text-primary" />,
            title: "4. Pricing & Payments",
            content: [
                "All prices are displayed in INR (₹).",
                "We accept UPI, Debit/Credit Cards, Net Banking, and Cash on Delivery (if available).",
                "Orders will only be confirmed after successful payment verification."
            ]
        },
        {
            icon: <Truck className="w-6 h-6 text-primary" />,
            title: "5. Shipping & Delivery",
            content: [
                "Delivery timelines may vary depending on your location.",
                "Frame & Sunglasses is not responsible for delays caused by courier services or unforeseen circumstances."
            ]
        },
        {
            icon: <RotateCcw className="w-6 h-6 text-primary" />,
            title: "6. Returns & Refunds",
            content: [
                "Frames and sunglasses may be returned within 7 days if unused and in original packaging.",
                "Prescription lenses are non-returnable unless there is a manufacturing defect.",
                "Refunds will be processed within 7–10 business days after approval."
            ]
        },
        {
            icon: <AlertTriangle className="w-6 h-6 text-primary" />,
            title: "7. Limitation of Liability",
            content: [
                "Incorrect prescription details submitted by customers.",
                "Minor color variations due to screen display.",
                "Delivery delays by third-party courier partners."
            ]
        },
        {
            icon: <Copyright className="w-6 h-6 text-primary" />,
            title: "8. Intellectual Property",
            content: [
                "All website content including logos, images, product designs, and text belongs to Frame & Sunglasses and may not be copied or used without permission."
            ]
        }
    ];

    return (
        <div className="max-w-5xl mx-auto py-20 px-6">
            <motion.div {...fadeIn} className="space-y-16">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 text-primary mb-2 shadow-sm border border-primary/5">
                        <FileText className="w-8 h-8" />
                    </div>
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">
                        Terms of Service
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                        <span className="w-8 h-px bg-gray-200"></span>
                        Last Updated: 2.0
                        <span className="w-8 h-px bg-gray-200"></span>
                    </div>
                </div>

                {/* Welcome Message */}
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-lg text-gray-600 leading-relaxed font-medium">
                        Welcome to <span className="text-gray-900 font-bold">Frame & Sunglasses</span>.
                        By accessing or using our website, you agree to the following Terms of Service.
                        Please read them carefully before placing an order.
                    </p>
                </div>

                {/* Terms Sections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all group"
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                    {section.icon}
                                </div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight pt-1">
                                    {section.title}
                                </h3>
                            </div>
                            <ul className="space-y-3">
                                {section.content.map((item, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-gray-500 font-bold leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200 mt-2 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="bg-[#000042] rounded-[40px] p-10 md:p-16 text-white text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                    <div className="relative z-10 space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Contact Information</h2>
                            <p className="text-white/60 font-bold uppercase tracking-widest text-xs">For any questions regarding these Terms</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="space-y-3 group">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-white group-hover:text-[#000042] transition-all">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-bold opacity-80">frameandsunglasses@gmail.com</p>
                            </div>
                            <div className="space-y-3 group">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-white group-hover:text-[#000042] transition-all">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-bold opacity-80">+91 8788617183</p>
                            </div>
                            <div className="space-y-3 group">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-white group-hover:text-[#000042] transition-all">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-bold opacity-80 leading-relaxed">
                                    Namuna Galli no 1 near rani saheba shop,<br />
                                    Amravati, Maharashtra
                                </p>
                            </div>
                        </div>

                        <div className="pt-8 flex flex-col items-center gap-4">
                            <div className="h-px w-20 bg-white/20"></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Frame & Sunglasses Optical</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TermsPage;
