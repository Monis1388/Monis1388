'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ChevronDown,
    Facebook,
    Instagram,
    Twitter,
    MessageSquare,
    ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const AccordionSection = ({ title, children, id }: { title: string, children: React.ReactNode, id: string }) => {
        const isOpen = openSection === id;
        return (
            <div className="border-b border-white/10">
                <button
                    onClick={() => toggleSection(id)}
                    className="w-full flex items-center justify-between py-6 text-left"
                >
                    <span className="text-xl font-bold tracking-tight">{title}</span>
                    <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                        >
                            <div className="pb-6 text-white/60 space-y-3 flex flex-col">
                                {children}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <footer className="bg-[#000042] text-white pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black tracking-tight">Buy Eyewear from Frame & Sunglasses</h2>
                        <button className="flex items-center gap-2 text-white/80 font-bold hover:text-white transition-colors">
                            Show more <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Accordion Sections */}
                    <div className="mt-12">
                        <AccordionSection title="Eyeglasses" id="eyeglasses">
                            <Link href="/shop?category=Eyeglasses" className="hover:text-white transition-colors">Men Eyeglasses</Link>
                            <Link href="/shop?category=Eyeglasses" className="hover:text-white transition-colors">Women Eyeglasses</Link>
                            <Link href="/shop?category=Eyeglasses" className="hover:text-white transition-colors">Kids Eyeglasses</Link>
                        </AccordionSection>

                        <AccordionSection title="Sunglasses" id="sunglasses">
                            <Link href="/shop?category=Sunglasses" className="hover:text-white transition-colors">Men Sunglasses</Link>
                            <Link href="/shop?category=Sunglasses" className="hover:text-white transition-colors">Women Sunglasses</Link>
                            <Link href="/shop?category=Sunglasses" className="hover:text-white transition-colors">Aviator Sunglasses</Link>
                        </AccordionSection>

                        <AccordionSection title="Kids" id="kids">
                            <Link href="/shop?category=Kids" className="hover:text-white transition-colors">Eyeglasses for Kids</Link>
                            <Link href="/shop?category=Kids" className="hover:text-white transition-colors">Sunglasses for Kids</Link>
                        </AccordionSection>

                        <AccordionSection title="More about Frame & Sunglasses" id="more">
                            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
                            <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
                            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        </AccordionSection>
                    </div>



                    <div className="border-t border-white/10 pt-12 space-y-6">
                        <div className="space-y-4">
                            <p className="text-white/60 text-sm font-bold uppercase tracking-widest">Follow Us</p>
                            <div className="flex gap-6">
                                <Link href="https://www.facebook.com/share/1TeAAFFvyU/" target="_blank" className="hover:scale-110 transition-transform">
                                    <Facebook className="w-8 h-8" />
                                </Link>
                                <Link href="https://www.instagram.com/frames_sunglasses_store?igsh=MW1rb3h6d2MzZ3M5Nw==" target="_blank" className="hover:scale-110 transition-transform">
                                    <Instagram className="w-8 h-8" />
                                </Link>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 text-white/40 text-sm font-bold">
                            <p>© {new Date().getFullYear()} All Rights Reserved | www.frameandsunglasses.com</p>
                            <p className="uppercase tracking-[0.2em] text-[10px]">Version 1.0.0</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
