"use client";
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import ProductCard from '../../components/ProductCard';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';

// Frame shapes with SVG icons
const FRAME_SHAPES = [
    {
        label: 'All',
        value: '',
        icon: (
            <svg viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-5">
                <rect x="2" y="4" width="16" height="16" rx="3" />
                <rect x="22" y="4" width="16" height="16" rx="3" />
                <line x1="18" y1="12" x2="22" y2="12" />
            </svg>
        ),
    },
    {
        label: 'Rectangle',
        value: 'Rectangle',
        icon: (
            <svg viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-5">
                <rect x="2" y="5" width="16" height="14" rx="2" />
                <rect x="22" y="5" width="16" height="14" rx="2" />
                <line x1="18" y1="12" x2="22" y2="12" />
            </svg>
        ),
    },
    {
        label: 'Round',
        value: 'Round',
        icon: (
            <svg viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-5">
                <circle cx="10" cy="12" r="8" />
                <circle cx="30" cy="12" r="8" />
                <line x1="18" y1="12" x2="22" y2="12" />
            </svg>
        ),
    },
    {
        label: 'Aviator',
        value: 'Aviator',
        icon: (
            <svg viewBox="0 0 40 26" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-5">
                <path d="M2 8 Q10 2 18 8 Q10 22 2 8Z" />
                <path d="M22 8 Q30 2 38 8 Q30 22 22 8Z" />
                <line x1="18" y1="10" x2="22" y2="10" />
            </svg>
        ),
    },
    {
        label: 'Square',
        value: 'Square',
        icon: (
            <svg viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-5">
                <rect x="2" y="4" width="16" height="16" rx="1" />
                <rect x="22" y="4" width="16" height="16" rx="1" />
                <line x1="18" y1="12" x2="22" y2="12" />
            </svg>
        ),
    },
    {
        label: 'Cat-Eye',
        value: 'Cat-Eye',
        icon: (
            <svg viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-5">
                <path d="M2 14 Q5 6 14 5 Q18 5 18 12 Q18 18 10 19 Q2 19 2 14Z" />
                <path d="M22 14 Q22 6 26 5 Q35 5 38 12 Q38 18 30 19 Q22 19 22 14Z" />
                <line x1="18" y1="12" x2="22" y2="12" />
            </svg>
        ),
    },
    {
        label: 'Hexagon',
        value: 'Hexagon',
        icon: (
            <svg viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-5">
                <polygon points="6,4 14,4 18,12 14,20 6,20 2,12" />
                <polygon points="26,4 34,4 38,12 34,20 26,20 22,12" />
                <line x1="18" y1="12" x2="22" y2="12" />
            </svg>
        ),
    },
    {
        label: 'Oval',
        value: 'Oval',
        icon: (
            <svg viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-5">
                <ellipse cx="10" cy="12" rx="8" ry="6" />
                <ellipse cx="30" cy="12" rx="8" ry="6" />
                <line x1="18" y1="12" x2="22" y2="12" />
            </svg>
        ),
    },
];

const FRAME_TYPES = ['Full Rim', 'Half Rim', 'Rimless'];

export default function Shop() {
    const searchParams = useSearchParams();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        gender: '',
        maxPrice: '',
        frameShape: '',
        frameType: '',
    });

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Remove empty filters before building query
            const cleanFilters: any = {};
            Object.entries(filters).forEach(([k, v]) => { if (v) cleanFilters[k] = v; });
            const query = new URLSearchParams(cleanFilters).toString();
            const { data } = await api.get(`/products?${query}`);
            setProducts(data.products);
        } catch (error) {
            console.error('Error fetching products', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e: any) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleShapeSelect = (value: string) => {
        setFilters({ ...filters, frameShape: value });
    };

    const clearAllFilters = () => {
        setFilters({ category: '', gender: '', maxPrice: '', frameShape: '', frameType: '' });
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    const FilterPanel = () => (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-black text-gray-900 text-base uppercase tracking-tighter flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="bg-primary text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </h3>
                {activeFilterCount > 0 && (
                    <button
                        onClick={clearAllFilters}
                        className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-1 transition-colors"
                    >
                        <X className="w-3 h-3" /> Clear
                    </button>
                )}
            </div>

            {/* Frame Shape */}
            <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                    Frame Shape
                </label>
                <div className="grid grid-cols-4 gap-2">
                    {FRAME_SHAPES.map((shape) => (
                        <button
                            key={shape.value}
                            onClick={() => handleShapeSelect(shape.value)}
                            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all active:scale-95 ${filters.frameShape === shape.value
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                        >
                            <span className={filters.frameShape === shape.value ? 'text-primary' : 'text-gray-500'}>
                                {shape.icon}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-wide leading-none text-center">
                                {shape.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Frame Type */}
            <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                    Frame Type
                </label>
                <div className="flex flex-wrap gap-2">
                    {['', ...FRAME_TYPES].map((type) => (
                        <button
                            key={type || 'all'}
                            onClick={() => setFilters({ ...filters, frameType: type })}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 ${filters.frameType === type
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                                }`}
                        >
                            {type || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Category */}
            <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                    Category
                </label>
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-white"
                >
                    <option value="">All Categories</option>
                    <option value="Eyeglasses">Eyeglasses</option>
                    <option value="Sunglasses">Sunglasses</option>
                    <option value="Kids">Kids</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Contact Lenses">Contact Lenses</option>
                </select>
            </div>

            {/* Gender */}
            <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                    Gender
                </label>
                <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-white"
                >
                    <option value="">All</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Unisex">Unisex</option>
                </select>
            </div>

            {/* Max Price */}
            <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                    Max Price (₹)
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                    <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                        placeholder="e.g. 5000"
                    />
                </div>
            </div>

            <button
                onClick={fetchProducts}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary transition-all active:scale-95 shadow-lg shadow-black/5"
            >
                Apply Filters
            </button>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Mobile filter toggle */}
            <div className="md:hidden flex items-center justify-between mb-2">
                <h1 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">Shop Eyewear</h1>
                <button
                    onClick={() => setShowMobileFilters(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-600 hover:border-gray-400 transition-all"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="bg-primary text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Mobile filter drawer */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setShowMobileFilters(false)}>
                    <div
                        className="absolute right-0 top-0 h-full w-[320px] bg-white p-6 overflow-y-auto shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <span className="font-black text-gray-900 uppercase tracking-tighter">Filters</span>
                            <button onClick={() => setShowMobileFilters(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <FilterPanel />
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-72 flex-shrink-0">
                <div className="sticky top-28 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <FilterPanel />
                </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
                <div className="hidden md:flex items-end justify-between mb-6">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">Shop Eyewear</h1>
                    {!loading && (
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                            {products.length} results
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-gray-100 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                        <div className="text-6xl mb-4">👓</div>
                        <p className="font-black uppercase tracking-widest text-sm">No products found</p>
                        <p className="text-xs mt-1 font-medium">Try adjusting your filters</p>
                        <button onClick={clearAllFilters} className="mt-4 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary transition-all">
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {products.map((product: any) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
