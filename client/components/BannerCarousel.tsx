"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { BACKEND_URL } from '../utils/api';

interface Banner {
    _id: string;
    title: string;
    subtitle: string;
    image: string;
    link: string;
}

interface BannerCarouselProps {
    banners: Banner[];
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (banners.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    if (banners.length === 0) return null;

    const nextSlide = () => setCurrent((prev) => (prev + 1) % banners.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

    return (
        <div className="relative h-[240px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl shadow-blue-900/10 group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, rotateY: 90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: -90 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src={
                            banners[current].image
                                ? banners[current].image.startsWith('http')
                                    ? banners[current].image
                                    : `${BACKEND_URL}${banners[current].image.startsWith('/') ? '' : '/'}${banners[current].image}`
                                : ''
                        }
                        className="w-full h-full object-cover"
                        alt={banners[current].title}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-md space-y-3"
                        >
                            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase italic tracking-tighter">
                                {banners[current].title.split(' ').map((word, i) => (
                                    <span key={i}>
                                        {word} {i === 0 && <br />}
                                    </span>
                                ))}
                            </h1>
                            <p className="text-white/90 font-bold text-lg">
                                {banners[current].subtitle}
                            </p>
                            <Link href={banners[current].link}>
                                <button className="mt-4 bg-white text-black px-8 py-3 rounded-full font-black text-sm uppercase tracking-wider hover:bg-primary hover:text-white transition-all transform active:scale-95 shadow-lg">
                                    Shop Now
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`h-1.5 rounded-full transition-all ${current === idx ? 'w-8 bg-white' : 'w-2 bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
