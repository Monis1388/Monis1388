"use client";
import Link from 'next/link';
import { Star, ShoppingCart, ImageOff } from 'lucide-react';
import { useState } from 'react';

const ProductCard = ({ product }: { product: any }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden flex flex-col h-full">
            {/* Image Container */}
            <Link href={`/product/${product._id}`} className="block relative aspect-square bg-[#F8F9FA] overflow-hidden">
                {!imgError ? (
                    <img
                        src={product.image?.startsWith('/uploads/') ? `http://localhost:5001${product.image}` : (product.image || 'https://images.unsplash.com/photo-1544717297-fa15bdfca03c?q=80&w=400')}
                        alt={product.name}
                        onError={() => setImgError(true)}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-50 text-gray-300">
                        <ImageOff className="w-8 h-8 opacity-20" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-4 text-center">{product.name}</span>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-0 right-0 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-bl-2xl text-[9px] font-black uppercase tracking-[0.15em] text-gray-900 z-10 border-l border-b border-gray-100 shadow-sm">
                    {product.category}
                </div>
            </Link>

            {/* Content Container */}
            <div className="p-5 flex flex-col flex-1">
                <div className="mb-3">
                    <p className="text-[9px] font-black text-primary mb-1.5 uppercase tracking-[0.2em]">{product.brand}</p>
                    <Link href={`/product/${product._id}`}>
                        <h3 className="font-extrabold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 text-base leading-tight min-h-[2.5rem]">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="flex items-center gap-1 mb-4">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 4) ? 'text-orange-400 fill-orange-400' : 'text-gray-100'}`} />
                        ))}
                    </div>
                    <span className="text-[10px] font-black text-gray-400 ml-1.5">({product.numReviews || 0})</span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1">Price</span>
                        <span className="text-xl font-black text-gray-900">₹{product.price}</span>
                    </div>

                    <Link
                        href={`/product/${product._id}`}
                        className="bg-gray-900 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 group-hover:bg-primary shadow-lg shadow-gray-200"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default ProductCard;
