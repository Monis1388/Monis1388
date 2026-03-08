'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Eye, Shield, Truck, Heart, Award } from 'lucide-react';

const AboutPage = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const features = [
        { icon: <CheckCircle2 className="w-6 h-6 text-primary" />, text: "Stylish Frames for Men & Women" },
        { icon: <Eye className="w-6 h-6 text-primary" />, text: "Prescription Lenses (Single Vision, Zero Power, Blue Cut)" },
        { icon: <Award className="w-6 h-6 text-primary" />, text: "Advanced Lens Customization" },
        { icon: <Shield className="w-6 h-6 text-primary" />, text: "Affordable Pricing" },
        { icon: <Truck className="w-6 h-6 text-primary" />, text: "Fast & Secure Delivery" }
    ];

    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <motion.div {...fadeIn} className="space-y-12">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">
                        About Us
                    </h1>
                    <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
                </div>

                {/* Welcome Message */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black text-gray-900 italic uppercase tracking-tight">
                        Welcome to Frame & Sunglasses Optical, where vision meets style.
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed font-medium">
                        We are dedicated to providing high-quality eyewear that combines comfort, clarity, and modern design.
                        Our mission is simple — to make premium eye care and fashionable frames accessible to everyone at affordable prices.
                    </p>
                </div>

                {/* What We Offer Section */}
                <div className="bg-gray-50 rounded-[32px] p-8 md:p-12 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-8 text-center md:text-left">
                        What We Offer
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-50"
                            >
                                <div className="flex-shrink-0">{feature.icon}</div>
                                <span className="text-sm font-bold text-gray-700">{feature.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Vision and personality Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <div className="text-primary font-black uppercase tracking-[0.2em] text-xs">Personality</div>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            We understand that glasses are not just a necessity — they are a part of your personality.
                            That’s why we carefully select frames that match different face shapes, lifestyles, and fashion preferences.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="text-primary font-black uppercase tracking-[0.2em] text-xs">Precision</div>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            Our lenses are crafted with precision to ensure maximum clarity and eye protection,
                            including options for blue light blocking and anti-glare coatings.
                        </p>
                    </div>
                </div>

                {/* Customer satisfaction Section */}
                <div className="border-t border-gray-100 pt-12 text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-2">
                        <Heart className="w-6 h-6" />
                    </div>
                    <p className="text-xl text-gray-800 leading-relaxed font-bold italic">
                        "Customer satisfaction is our top priority. From selecting the right frame to entering your prescription details,
                        we aim to provide a smooth and hassle-free shopping experience."
                    </p>
                    <div className="text-gray-400 font-bold uppercase tracking-widest text-sm pt-4">
                        Thank you for trusting us with your vision.
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AboutPage;
