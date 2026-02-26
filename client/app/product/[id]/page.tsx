"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import { Star, ShieldCheck, Truck, RotateCcw, ShoppingCart, ImageOff, Glasses } from 'lucide-react';

export default function ProductDetail() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [mainImage, setMainImage] = useState('');
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`products/${id}`);
                setProduct(data);
                setMainImage(data.image);
            } catch (error) {
                console.error('Error fetching product', error);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchProduct();
    }, [id]);

    const formatImageUrl = (img: string) => {
        if (!img) return 'https://images.unsplash.com/photo-1544717297-fa15bdfca03c?q=80&w=800';
        return img.startsWith('/uploads/') ? `http://localhost:5001${img}` : img;
    };

    const addToCartHandler = async () => {
        if (!user) {
            router.push(`/login?redirect=/product/${id}`);
            return;
        }
        try {
            await api.post('users/cart', {
                productId: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                qty
            });
            alert('Added to cart!');
            router.push('/cart');
        } catch (error) {
            alert('Failed to add to cart');
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!product) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-black text-gray-900">Product Not Found</h2>
            <button onClick={() => router.push('/')} className="mt-4 text-primary font-bold">Return Home</button>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                {/* Images Section */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="relative aspect-square bg-[#F8F9FA] rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm group">
                        {!imgError ? (
                            <img
                                src={formatImageUrl(mainImage)}
                                alt={product.name}
                                onError={() => setImgError(true)}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gray-50 text-gray-300">
                                <ImageOff className="w-16 h-16 opacity-10" />
                                <span className="font-black uppercase tracking-widest text-sm opacity-20">Image Unavailable</span>
                            </div>
                        )}

                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                            <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm border border-white">
                                {product.brand}
                            </span>
                            <span className="bg-gray-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                                {product.category}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {[product.image, ...product.images || []].map((img: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setMainImage(img);
                                    setImgError(false);
                                }}
                                className={`relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${mainImage === img ? 'border-primary ring-4 ring-primary/5' : 'border-transparent hover:border-gray-200'}`}
                            >
                                <img
                                    src={formatImageUrl(img)}
                                    alt={`Product view ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info Section */}
                <div className="lg:col-span-5 flex flex-col pt-4">
                    <div className="space-y-2 mb-8">
                        <div className="flex items-center gap-1.5 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 4) ? 'text-orange-400 fill-orange-400' : 'text-gray-100'}`} />
                            ))}
                            <span className="text-xs font-black text-gray-400 ml-1">({product.numReviews} Reviews)</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tighter uppercase italic">
                            {product.name}
                        </h1>
                        <p className="text-lg font-bold text-gray-400 flex items-center gap-3">
                            {product.gender}
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                            {product.brand}
                        </p>
                    </div>

                    <div className="flex items-baseline gap-3 mb-10">
                        <span className="text-5xl font-black text-gray-900 tracking-tighter">₹{product.price}</span>
                        <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 italic">Save with Gold Membership</span>
                    </div>

                    <div className="space-y-6 mb-10 pb-10 border-b border-gray-100">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Frame Type</span>
                                <p className="font-bold text-gray-800">{product.frameType}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Frame Shape</span>
                                <p className="font-bold text-gray-800">{product.frameShape}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Color Variant</span>
                                <p className="font-bold text-gray-800">{product.frameColor}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Availability</span>
                                <p className={`font-bold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.countInStock > 0 ? `${product.countInStock} Left in Stock` : 'Sold Out'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex flex-col gap-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Quantity</label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-200 rounded-full p-1 bg-white shadow-sm ring-4 ring-gray-50/50">
                                    <button
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="w-10 h-10 flex items-center justify-center font-black text-gray-500 hover:text-primary transition-colors"
                                    >—</button>
                                    <span className="w-12 text-center font-black text-lg">{qty}</span>
                                    <button
                                        onClick={() => setQty(Math.min(product.countInStock || 1, qty + 1))}
                                        className="w-10 h-10 flex items-center justify-center font-black text-gray-500 hover:text-primary transition-colors"
                                    >+</button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {product.category === 'Eyeglasses' ? (
                                <button
                                    onClick={() => router.push(`/lens-details?productId=${product._id}`)}
                                    disabled={product.countInStock === 0}
                                    className="flex-[2] bg-blue-600 text-white py-5 rounded-full font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:bg-gray-400 shadow-xl shadow-blue-200"
                                >
                                    <Glasses className="w-5 h-5" />
                                    {product.countInStock === 0 ? 'Notify Me' : 'Select Lenses & Buy'}
                                </button>
                            ) : (
                                <button
                                    onClick={addToCartHandler}
                                    disabled={product.countInStock === 0}
                                    className="flex-[2] bg-gray-900 text-white py-5 rounded-full font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all hover:bg-primary active:scale-95 disabled:opacity-50 disabled:bg-gray-400 shadow-xl shadow-gray-200"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {product.countInStock === 0 ? 'Notify Me' : 'Add to Shopping Bag'}
                                </button>
                            )}
                            <button className="flex-1 border-2 border-gray-900 py-5 rounded-full font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95">
                                Try-On 🕶️
                            </button>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-12 grid grid-cols-3 gap-4 border-t border-gray-100 pt-8 text-center text-[9px] font-black uppercase tracking-widest text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-gray-900" />
                            <span>100% Original</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <RotateCcw className="w-5 h-5 text-gray-900" />
                            <span>14 Day Returns</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Truck className="w-5 h-5 text-gray-900" />
                            <span>Free Shipping</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description Section */}
            <div className="mt-24 max-w-3xl">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Product Story</h3>
                <h2 className="text-3xl font-black text-gray-900 mb-6 uppercase italic">Crafted for Excellence</h2>
                <div className="prose prose-lg text-gray-600 leading-relaxed font-medium">
                    {product.description}
                </div>
            </div>
        </div>
    );
}
