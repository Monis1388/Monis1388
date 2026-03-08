"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../../utils/api'; // Correct relative path from app/admin/dashboard
import { useAuth } from '../../../context/AuthContext';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Trash2, X, AlertCircle, Upload, ArrowLeft, Minus, Edit, Eye, Search, Filter, Image, Copy, Check } from 'lucide-react';

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [stats, setStats] = useState({ ordersCount: 0, productsCount: 0, usersCount: 0, totalSales: 0 });
    const [loading, setLoading] = useState(true);

    // Lists
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [products, setProductsList] = useState([]);
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [mediaFiles, setMediaFiles] = useState<string[]>([]);
    const [activeInternalTab, setActiveInternalTab] = useState('overview');
    const [copiedUrl, setCopiedUrl] = useState('');

    // Modal States
    const [showAddModal, setShowAddModal] = useState(false);
    const [showBannerModal, setShowBannerModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [editingBanner, setEditingBanner] = useState<any>(null);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [viewingOrder, setViewingOrder] = useState<any>(null);

    const [newBanner, setNewBanner] = useState({
        title: '', subtitle: '', image: '', link: '/', order: 0
    });

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '', type: 'Eyeglasses', image: '', priceText: '', order: 0
    });

    // Filtering & Searching
    const [productSearch, setProductSearch] = useState('');
    const [productCategoryFilter, setProductCategoryFilter] = useState('All');
    const [orderStatusFilter, setOrderStatusFilter] = useState('All');

    const [newProduct, setNewProduct] = useState({
        name: '', price: '', image: '', brand: '', category: 'Eyeglasses',
        countInStock: '', description: '', gender: 'Men', frameType: 'Full Rim',
        frameShape: 'Rectangle', frameColor: 'Black'
    });

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'admin') {
                router.push('/');
            } else {
                fetchStats();
            }
        }
    }, [user, authLoading, router]);

    const uploadFileHandler = async (e: any, isEdit = false) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await api.post('/upload', formData, config);
            if (isEdit) {
                setEditingProduct((prev: any) => ({ ...prev, image: data }));
            } else {
                setNewProduct((prev: any) => ({ ...prev, image: data }));
            }
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert('Image upload failed.');
        }
    };

    const uploadBannerFileHandler = async (e: any, isEdit = false) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await api.post('/upload', formData, config);
            if (isEdit) {
                setEditingBanner((prev: any) => ({ ...prev, image: data }));
            } else {
                setNewBanner((prev: any) => ({ ...prev, image: data }));
            }
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert('Banner upload failed.');
        }
    };

    const uploadCategoryFileHandler = async (e: any, isEdit = false) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await api.post('/upload', formData, config);
            if (isEdit) {
                setEditingCategory((prev: any) => ({ ...prev, image: data }));
            } else {
                setNewCategory((prev: any) => ({ ...prev, image: data }));
            }
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert('Category upload failed.');
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await api.get('orders/stats');
            setStats(data);
        } catch (error: any) {
            console.error('Stats Sync Error:', error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('users');
            setUsers(data);
        } catch (error: any) {
            console.error('User Registry Error:', error.response?.data?.message || error.message);
        }
    }

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('orders');
            setOrders(data);
        } catch (error: any) {
            console.error('Logistics Error:', error.response?.data?.message || error.message);
        }
    }

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('products');
            setProductsList(data.products || []);
        } catch (error: any) {
            console.error('Inventory Sync Error:', error.response?.data?.message || error.message);
        }
    }

    const fetchMedia = async () => {
        try {
            const { data } = await api.get('upload');
            setMediaFiles(data);
        } catch (error: any) {
            console.error('Media Sync Error:', error.response?.data?.message || error.message);
        }
    }

    const fetchBanners = async () => {
        try {
            // ?all=true fetches ALL banners (active + inactive) for admin view
            const { data } = await api.get('banners?all=true');
            setBanners(data);
        } catch (error: any) {
            console.error('Banner Sync Error:', error.response?.data?.message || error.message);
        }
    }

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('categories');
            setCategories(data);
        } catch (error: any) {
            console.error('Category Sync Error:', error.response?.data?.message || error.message);
        }
    }

    const handleTabChange = (tab: string) => {
        setActiveInternalTab(tab);
        if (tab === 'users') fetchUsers();
        if (tab === 'orders') fetchOrders();
        if (tab === 'products') fetchProducts();
        if (tab === 'media') fetchMedia();
        if (tab === 'banners') fetchBanners();
        if (tab === 'categories') fetchCategories();
    }

    const handleUpdateStock = async (id: string, currentStock: number, delta: number) => {
        const newStock = Math.max(0, currentStock + delta);
        try {
            await api.put(`/products/${id}`, { countInStock: newStock });
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert('Failed to update stock');
        }
    }

    const handleDeleteProduct = async (id: string) => {
        if (window.confirm('Delete this product permanently?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error(error);
            }
        }
    }

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/products', newProduct);
            setShowAddModal(false);
            fetchProducts();
            setNewProduct({
                name: '', price: '', image: '', brand: '', category: 'Eyeglasses',
                countInStock: '', description: '', gender: 'Men', frameType: 'Full Rim',
                frameShape: 'Rectangle', frameColor: 'Black'
            });
            alert('Added successfully!');
        } catch (error) { console.error(error); }
    }

    const handleEditProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put(`/products/${editingProduct._id}`, editingProduct);
            setEditingProduct(null);
            fetchProducts();
            alert('Updated successfully!');
        } catch (error) { console.error(error); }
    }

    const handleAddBanner = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/banners', newBanner);
            setShowBannerModal(false);
            fetchBanners();
            setNewBanner({ title: '', subtitle: '', image: '', link: '/', order: 0 });
            alert('Banner added!');
        } catch (error) { console.error(error); }
    }

    const handleEditBannerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put(`/banners/${editingBanner._id}`, editingBanner);
            setEditingBanner(null);
            fetchBanners();
            alert('Banner updated!');
        } catch (error) { console.error(error); }
    }

    const handleDeleteBanner = async (id: string) => {
        if (window.confirm('Remove this banner?')) {
            try {
                await api.delete(`/banners/${id}`);
                fetchBanners();
            } catch (error) { console.error(error); }
        }
    }

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/categories', newCategory);
            setShowCategoryModal(false);
            fetchCategories();
            setNewCategory({ name: '', type: 'Eyeglasses', image: '', priceText: '', order: 0 });
            alert('Category added!');
        } catch (error) { console.error(error); }
    }

    const handleEditCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put(`/categories/${editingCategory._id}`, editingCategory);
            setEditingCategory(null);
            fetchCategories();
            alert('Category updated!');
        } catch (error) { console.error(error); }
    }

    const handleDeleteCategory = async (id: string) => {
        if (window.confirm('Remove this category?')) {
            try {
                await api.delete(`/categories/${id}`);
                fetchCategories();
            } catch (error) { console.error(error); }
        }
    }

    const handleToggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (window.confirm(`System Security Protocol: Authorize role elevation/demotion to ${newRole.toUpperCase()}?`)) {
            try {
                await api.put(`/users/${userId}`, { role: newRole });
                fetchUsers();
                alert('Privilege levels updated successfully.');
            } catch (error) {
                console.error(error);
                alert('Operation failed: Targeted user management endpoint unavailable.');
            }
        }
    }

    const handleShipOrder = async (orderId: string) => {
        try {
            await api.put(`/orders/${orderId}/ship`);
            fetchOrders();
            alert('Logistics Sync: Order marked as SHIPPED.');
        } catch (error) {
            console.error(error);
            alert('Sync failed: Could not update shipment status.');
        }
    }

    const handleDeliverOrder = async (orderId: string) => {
        try {
            await api.put(`/orders/${orderId}/deliver`);
            fetchOrders();
            alert('Fulfillment Locked: Order marked as DELIVERED.');
        } catch (error) {
            console.error(error);
            alert('Fulfillment failed: Could not update delivery status.');
        }
    }

    const copyToClipboard = (text: string) => {
        const fullUrl = text.startsWith('/uploads/') ? `http://localhost:5001${text}` : text;
        navigator.clipboard.writeText(fullUrl);
        setCopiedUrl(text);
        setTimeout(() => setCopiedUrl(''), 2000);
    }

    const filteredProducts = products.filter((p: any) => {
        const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase());
        const matchesCat = productCategoryFilter === 'All' || p.category === productCategoryFilter;
        return matchesSearch && matchesCat;
    });

    const filteredOrders = orders.filter((o: any) => {
        if (orderStatusFilter === 'All') return true;
        return o.orderStatus === orderStatusFilter;
    });

    if (loading) return <div>Loading Admin...</div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex flex-col">
                    <Link href="/" className="text-xs font-black uppercase text-gray-400 hover:text-primary mb-1 flex items-center gap-1">
                        <ArrowLeft className="w-3 h-3" /> Back to Store
                    </Link>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Management Console</h1>
                </div>
                {activeInternalTab === 'products' && (
                    <button onClick={() => setShowAddModal(true)} className="bg-black text-white px-8 h-14 rounded-2xl font-black uppercase tracking-tighter text-sm flex items-center gap-2 hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10">
                        <Plus className="w-5 h-5" /> New Collection
                    </button>
                )}
                {activeInternalTab === 'banners' && (
                    <button onClick={() => setShowBannerModal(true)} className="bg-black text-white px-8 h-14 rounded-2xl font-black uppercase tracking-tighter text-sm flex items-center gap-2 hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10">
                        <Plus className="w-5 h-5" /> New Banner
                    </button>
                )}
                {activeInternalTab === 'categories' && (
                    <button onClick={() => setShowCategoryModal(true)} className="bg-black text-white px-8 h-14 rounded-2xl font-black uppercase tracking-tighter text-sm flex items-center gap-2 hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10">
                        <Plus className="w-5 h-5" /> New Category
                    </button>
                )}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {[
                    { label: 'Revenue', value: `₹${stats.totalSales.toLocaleString()}`, color: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-100' },
                    { label: 'Orders', value: stats.ordersCount, color: 'bg-amber-50 text-amber-700', border: 'border-amber-100' },
                    { label: 'Inventory', value: stats.productsCount, color: 'bg-purple-50 text-purple-700', border: 'border-purple-100' },
                    { label: 'Clientele', value: stats.usersCount, color: 'bg-blue-50 text-blue-700', border: 'border-blue-100' }
                ].map((m, i) => (
                    <div key={i} className={`p-6 rounded-3xl border ${m.border} ${m.color} flex flex-col gap-2 shadow-sm`}>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{m.label}</span>
                        <span className="text-3xl font-black italic tracking-tighter">{m.value}</span>
                    </div>
                ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-2 mb-8 bg-gray-100/50 p-2 rounded-2xl w-fit overflow-x-auto no-scrollbar max-w-full">
                {['overview', 'orders', 'products', 'users', 'media', 'banners', 'categories'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeInternalTab === tab ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-20 min-h-[400px]">

                {/* Product Search/Filter Bar */}
                {activeInternalTab === 'products' && (
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 bg-gray-50/30">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by model or brand..."
                                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold"
                                value={productSearch}
                                onChange={e => setProductSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none text-sm font-black uppercase tracking-tighter"
                            value={productCategoryFilter}
                            onChange={e => setProductCategoryFilter(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            <option value="Eyeglasses">Eyeglasses</option>
                            <option value="Sunglasses">Sunglasses</option>
                            <option value="Kids">Kids</option>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Contact Lenses">Contact Lenses</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>
                )}

                {/* Order Filter Bar */}
                {activeInternalTab === 'orders' && (
                    <div className="p-6 border-b border-gray-100 flex gap-2 bg-gray-50/30 overflow-x-auto">
                        {['All', 'Pending', 'Shipped', 'Delivered'].map(status => (
                            <button
                                key={status}
                                onClick={() => setOrderStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${orderStatusFilter === status ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                )}

                {/* Data Tables */}
                <div className="overflow-x-auto">
                    {activeInternalTab === 'products' && (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/80 text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5">Product Details</th>
                                    <th className="px-8 py-5">Category</th>
                                    <th className="px-8 py-5">Inventory</th>
                                    <th className="px-8 py-5">Price</th>
                                    <th className="px-8 py-5 text-right">Settings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredProducts.map((p: any) => (
                                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                                                    <img src={p.image?.startsWith('/uploads/') ? `http://localhost:5001${p.image}` : p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-gray-900 truncate leading-tight">{p.name}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{p.brand}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5"><span className="px-2.5 py-1 rounded-md bg-gray-100 text-[10px] font-black uppercase text-gray-600 tracking-tighter">{p.category}</span></td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => handleUpdateStock(p._id, p.countInStock, -1)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-gray-400 hover:text-primary"><Minus className="w-3.5 h-3.5" /></button>
                                                <span className={`text-[12px] font-black w-6 text-center ${p.countInStock < 5 ? 'text-red-500' : 'text-gray-900'}`}>{p.countInStock}</span>
                                                <button onClick={() => handleUpdateStock(p._id, p.countInStock, 1)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-gray-400 hover:text-primary"><Plus className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 font-black text-gray-900 tracking-tighter">₹{p.price}</td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => setEditingProduct(p)} className="p-2.5 rounded-xl text-gray-400 hover:text-primary hover:bg-primary/5 transition-all"><Edit className="w-5 h-5" /></button>
                                                <button onClick={() => handleDeleteProduct(p._id)} className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeInternalTab === 'orders' && (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/80 text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5">Order ID</th>
                                    <th className="px-8 py-5">Customer</th>
                                    <th className="px-8 py-5">Invoice</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Review</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.map((o: any) => (
                                    <tr key={o._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5 font-mono text-xs text-gray-400">#{o._id.substring(18).toUpperCase()}</td>
                                        <td className="px-8 py-5 font-black text-gray-900">{o.user?.name}</td>
                                        <td className="px-8 py-5 font-black tracking-tighter">₹{o.totalPrice}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase italic tracking-tighter ${o.orderStatus === 'Shipped' ? 'bg-indigo-50 text-indigo-700' : o.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                {o.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button onClick={() => setViewingOrder(o)} className="px-4 py-2 rounded-lg bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-lg shadow-black/5">Inspect</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeInternalTab === 'users' && (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/80 text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5">Identity</th>
                                    <th className="px-8 py-5">Contact</th>
                                    <th className="px-8 py-5">Auth Level</th>
                                    <th className="px-8 py-5 text-right">Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map((u: any) => (
                                    <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-primary font-black flex items-center justify-center text-xs uppercase">{u.name[0]}</div>
                                            <span className="font-black text-gray-900">{u.name}</span>
                                        </td>
                                        <td className="px-8 py-5 text-gray-500 font-medium">{u.email}</td>
                                        <td className="px-8 py-5"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>{u.role}</span></td>
                                        <td className="px-8 py-5 text-right">
                                            {user && u._id !== user._id && (
                                                <button onClick={() => handleToggleRole(u._id, u.role)} className="text-[10px] font-black text-gray-400 hover:text-primary uppercase underline underline-offset-4 tracking-[0.2em]">Switch Role</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeInternalTab === 'media' && (
                        <div className="p-8">
                            <div className="max-w-xl mb-12">
                                <h3 className="text-xl font-black text-gray-900 mb-2 italic uppercase tracking-tighter">Media Asset Center</h3>
                                <p className="text-xs font-bold text-gray-500 mb-6">Upload banners, lifestyle shots, and brand assets to generate safe direct-links.</p>

                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/50 hover:bg-gray-50 hover:border-primary/20 transition-all cursor-pointer group">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        {uploading ? (
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-3"></div>
                                        ) : (
                                            <Upload className="w-10 h-10 text-gray-300 group-hover:text-primary transition-colors mb-4" />
                                        )}
                                        <p className="text-sm font-black text-gray-500 group-hover:text-gray-900 transition-colors uppercase tracking-widest leading-none">Drop New Asset</p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-2 italic">PNG, JPG or JPEG (MAX. 5MB)</p>
                                    </div>
                                    <input type="file" className="hidden" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const formData = new FormData();
                                            formData.append('image', file);
                                            setUploading(true);
                                            api.post('upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                                                .then(() => {
                                                    fetchMedia();
                                                    setUploading(false);
                                                })
                                                .catch(() => setUploading(false));
                                        }
                                    }} />
                                </label>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {mediaFiles.map((file, idx) => (
                                    <div key={idx} className="group relative flex flex-col bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                                        <div className="aspect-[16/9] w-full bg-white relative overflow-hidden">
                                            <img src={`http://localhost:5001${file}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    onClick={() => copyToClipboard(file)}
                                                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all"
                                                >
                                                    {copiedUrl === file ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-gray-900" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4 flex items-center justify-between gap-2">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 truncate flex-1">{file.split('/').pop()}</span>
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm('Erase this asset from the mainframe?')) {
                                                        try {
                                                            const fileName = file.split('/').pop();
                                                            await api.delete(`upload/${fileName}`);
                                                            fetchMedia();
                                                        } catch (error) {
                                                            console.error('Delete failed', error);
                                                        }
                                                    }
                                                }}
                                                className="text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {mediaFiles.length === 0 && (
                                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-300">
                                        <Image className="w-16 h-16 opacity-10 mb-4" />
                                        <span className="text-xs font-black uppercase tracking-widest opacity-20">Media Repository Empty</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeInternalTab === 'banners' && (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/80 text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5">Banner Design</th>
                                    <th className="px-8 py-5">Title / Subtitle</th>
                                    <th className="px-8 py-5">Link</th>
                                    <th className="px-8 py-5">Order</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Settings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {banners.map((b: any) => (
                                    <tr key={b._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="w-24 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                                <img src={b.image?.startsWith('/uploads/') ? `http://localhost:5001${b.image}` : b.image} className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="font-black text-gray-900 leading-tight">{b.title}</p>
                                            <p className="text-[10px] font-bold text-gray-400 truncate max-w-[200px]">{b.subtitle}</p>
                                        </td>
                                        <td className="px-8 py-5 font-mono text-[10px] text-gray-400 max-w-[150px] truncate">{b.link}</td>
                                        <td className="px-8 py-5 font-black text-gray-900">{b.order}</td>
                                        <td className="px-8 py-5">
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await api.put(`/banners/${b._id}`, { ...b, isActive: !b.isActive });
                                                        fetchBanners();
                                                    } catch (error) { console.error(error); }
                                                }}
                                                className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${b.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}
                                            >
                                                {b.isActive ? 'Active' : 'Hidden'}
                                            </button>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => setEditingBanner(b)} className="p-2.5 rounded-xl text-gray-400 hover:text-primary hover:bg-primary/5 transition-all"><Edit className="w-5 h-5" /></button>
                                                <button onClick={() => handleDeleteBanner(b._id)} className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeInternalTab === 'categories' && (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/80 text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5">Category Visual</th>
                                    <th className="px-8 py-5">Name / Type</th>
                                    <th className="px-8 py-5">Price Text</th>
                                    <th className="px-8 py-5">Order</th>
                                    <th className="px-8 py-5 text-right">Settings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {categories.map((c: any) => (
                                    <tr key={c._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden border border-gray-200">
                                                <img src={c.image?.startsWith('/uploads/') ? `http://localhost:5001${c.image}` : c.image} className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="font-black text-gray-900 leading-tight">{c.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{c.type}</p>
                                        </td>
                                        <td className="px-8 py-5 font-black text-primary text-[10px]">{c.priceText || '-'}</td>
                                        <td className="px-8 py-5 font-black text-gray-900">{c.order}</td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => setEditingCategory(c)} className="p-2.5 rounded-xl text-gray-400 hover:text-primary hover:bg-primary/5 transition-all"><Edit className="w-5 h-5" /></button>
                                                <button onClick={() => handleDeleteCategory(c._id)} className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-bold italic">No home categories initialized.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {activeInternalTab === 'overview' && (
                        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-50/20">
                            {/* Recent Activity */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    Live Logistics (Recent Orders)
                                </h3>
                                <div className="space-y-3">
                                    {orders.slice(0, 5).map((o: any) => (
                                        <div key={o._id} className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-black text-[10px] text-gray-400">
                                                    #{o._id.substring(20)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900">{o.user?.name}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">₹{o.totalPrice} • {o.orderStatus}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => setViewingOrder(o)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-all"><Eye className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                    {orders.length === 0 && <p className="text-xs font-bold text-gray-400 italic">No logistics data available.</p>}
                                </div>
                            </div>

                            {/* Inventory Alerts */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Inventory Hotlist (Low Stock)</h3>
                                <div className="space-y-3">
                                    {products.filter((p: any) => p.countInStock < 10).slice(0, 5).map((p: any) => (
                                        <div key={p._id} className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <img src={p.image?.startsWith('/uploads/') ? `http://localhost:5001${p.image}` : p.image} className="w-10 h-10 rounded-lg object-cover" />
                                                <div>
                                                    <p className="text-sm font-black text-gray-900">{p.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1 w-20 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-red-500" style={{ width: `${(p.countInStock / 10) * 100}%` }} />
                                                        </div>
                                                        <span className="text-[10px] font-black text-red-500 uppercase">{p.countInStock} Units Left</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button onClick={() => setEditingProduct(p)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-all"><Edit className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                    {products.filter((p: any) => p.countInStock < 10).length === 0 && (
                                        <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                                            <Sparkles className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                                            <p className="text-xs font-bold text-gray-400 italic">All units at optimal capacity.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* PRODUCT MODAL (Add/Edit) */}
            {(showAddModal || editingProduct) && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl relative border border-gray-100">
                        <div className="sticky top-0 bg-white/80 backdrop-blur-md px-10 py-8 border-b border-gray-50 flex items-center justify-between z-20">
                            <div>
                                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900">{editingProduct ? 'Update Collection' : 'Archive Entry'}</h2>
                                <p className="text-sm text-gray-400 font-bold tracking-tight">Configure all parameters for this optical unit.</p>
                            </div>
                            <button onClick={() => { setShowAddModal(false); setEditingProduct(null); }} className="w-12 h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center justify-center transition-all"><X className="w-6 h-6" /></button>
                        </div>

                        <form onSubmit={editingProduct ? handleEditProductSubmit : handleAddProduct} className="p-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {/* Left Side: Image Upload & Preview */}
                                <div className="space-y-6">
                                    <div className="relative group">
                                        <label htmlFor="edit-upload" className="cursor-pointer block">
                                            <div className="aspect-[4/5] rounded-[32px] bg-gray-50 border-2 border-dashed border-gray-100 overflow-hidden flex flex-col items-center justify-center relative p-2 group-hover:border-primary/30 transition-all">
                                                {(editingProduct?.image || newProduct.image) ? (
                                                    <>
                                                        <img src={(editingProduct || newProduct).image?.startsWith('/uploads/') ? `http://localhost:5001${(editingProduct || newProduct).image}` : (editingProduct || newProduct).image} className="w-full h-full object-cover rounded-[28px]" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                            <span className="bg-white text-black px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">Change Piece</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-3 text-center">
                                                        {uploading ? (
                                                            <Sparkles className="w-10 h-10 text-primary animate-spin" />
                                                        ) : (
                                                            <Upload className="w-10 h-10 text-gray-300" />
                                                        )}
                                                        <div className="px-4">
                                                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">
                                                                {uploading ? 'Processing Architecture...' : 'Awaiting Visuals'}
                                                            </span>
                                                            {!uploading && <span className="text-[8px] font-bold text-primary/60 uppercase tracking-tighter mt-1 block">Click to upload file</span>}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                        <input type="file" id="edit-upload" className="hidden" onChange={(e) => uploadFileHandler(e, !!editingProduct)} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Asset Reference</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all text-sm font-bold truncate"
                                            placeholder="https://..."
                                            value={editingProduct ? editingProduct.image : newProduct.image}
                                            onChange={e => editingProduct ? setEditingProduct({ ...editingProduct, image: e.target.value }) : setNewProduct({ ...newProduct, image: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Right Side: Details Form */}
                                <div className="md:col-span-2 grid grid-cols-2 gap-6">
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Model Designation</label>
                                        <input required className="input-modern" value={editingProduct ? editingProduct.name : newProduct.name} onChange={e => editingProduct ? setEditingProduct({ ...editingProduct, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Archive ID (Brand)</label>
                                        <input required className="input-modern" value={editingProduct ? editingProduct.brand : newProduct.brand} onChange={e => editingProduct ? setEditingProduct({ ...editingProduct, brand: e.target.value }) : setNewProduct({ ...newProduct, brand: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Market Valuation</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">₹</span>
                                            <input required type="number" step="0.01" className="input-modern !pl-10" value={editingProduct ? editingProduct.price : newProduct.price} onChange={e => editingProduct ? setEditingProduct({ ...editingProduct, price: e.target.value }) : setNewProduct({ ...newProduct, price: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Warehouse Units</label>
                                        <input required type="number" className="input-modern" value={editingProduct ? editingProduct.countInStock : newProduct.countInStock} onChange={e => editingProduct ? setEditingProduct({ ...editingProduct, countInStock: e.target.value }) : setNewProduct({ ...newProduct, countInStock: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Unit Typology</label>
                                        <select className="input-modern" value={editingProduct ? editingProduct.category : newProduct.category} onChange={e => editingProduct ? setEditingProduct({ ...editingProduct, category: e.target.value }) : setNewProduct({ ...newProduct, category: e.target.value })}>
                                            <option>Eyeglasses</option>
                                            <option>Sunglasses</option>
                                            <option>Kids</option>
                                            <option>Men</option>
                                            <option>Women</option>
                                            <option>Contact Lenses</option>
                                            <option>Accessories</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Archive Target (Gender)</label>
                                        <select className="input-modern" value={editingProduct ? editingProduct.gender : newProduct.gender} onChange={e => editingProduct ? setEditingProduct({ ...editingProduct, gender: e.target.value }) : setNewProduct({ ...newProduct, gender: e.target.value })}>
                                            <option>Men</option>
                                            <option>Women</option>
                                            <option>Kids</option>
                                            <option>Unisex</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Frame Architecture (Type)</label>
                                        <select className="input-modern" value={editingProduct ? editingProduct.frameType : newProduct.frameType} onChange={e => editingProduct ? setEditingProduct({ ...editingProduct, frameType: e.target.value }) : setNewProduct({ ...newProduct, frameType: e.target.value })}>
                                            <option>Full Rim</option>
                                            <option>Half Rim</option>
                                            <option>Rimless</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Geometry (Shape)</label>
                                        <select className="input-modern" value={editingProduct ? editingProduct.frameShape : newProduct.frameShape} onChange={e => editingProduct ? setEditingProduct({ ...editingProduct, frameShape: e.target.value }) : setNewProduct({ ...newProduct, frameShape: e.target.value })}>
                                            <option>Rectangle</option>
                                            <option>Square</option>
                                            <option>Round</option>
                                            <option>Aviator</option>
                                            <option>Cat Eye</option>
                                            <option>Oval</option>
                                            <option>Wayfarer</option>
                                            <option>Geometric</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Chromatic Selection (Color)</label>
                                        <input className="input-modern" placeholder="e.g. Jet Black, Gunmetal" value={editingProduct ? editingProduct.frameColor : newProduct.frameColor} onChange={e => editingProduct ? setEditingProduct({ ...editingProduct, frameColor: e.target.value }) : setNewProduct({ ...newProduct, frameColor: e.target.value })} />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Narrative Description</label>
                                        <textarea rows={4} className="input-modern resize-none" value={editingProduct ? editingProduct.description : newProduct.description} onChange={e => editingProduct ? setEditingProduct({ ...editingProduct, description: e.target.value }) : setNewProduct({ ...newProduct, description: e.target.value })} />
                                    </div>

                                    <button type="submit" className="col-span-2 h-16 bg-black text-white rounded-[24px] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-2xl shadow-black/20 mt-4 leading-none">
                                        {editingProduct ? 'Commit Changes' : 'Initialize Piece'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* ORDER VIEW MODAL */}
            {viewingOrder && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[200] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-8 border-b flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order Inspection / #{viewingOrder._id.substring(18).toUpperCase()}</span>
                            <button onClick={() => setViewingOrder(null)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center"><X className="w-5 h-5 text-gray-900" /></button>
                        </div>
                        <div className="p-10 space-y-8">
                            <div className="space-y-4">
                                {viewingOrder.orderItems.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 border overflow-hidden"><img src={item.image} className="w-full h-full object-cover" /></div>
                                        <div className="flex-1">
                                            <p className="font-black text-xs text-gray-900 leading-none">{item.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">QTY: {item.qty} × ₹{item.price}</p>

                                            {(item.lensStats || item.lensPower) && (
                                                <div className="mt-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 shadow-inner">
                                                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-100/30">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-5 h-5 bg-blue-500 rounded-lg flex items-center justify-center shadow-md shadow-blue-200">
                                                                <Sparkles className="w-3 h-3 text-white" />
                                                            </div>
                                                            <span className="text-[10px] font-black uppercase text-blue-700 tracking-widest">Prescription Verified</span>
                                                        </div>
                                                        <span className="text-[9px] font-black text-blue-500/60 uppercase tracking-tighter">
                                                            {(item.lensStats || item.lensPower).lensType || 'Standard'}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        {((item.lensStats || item.lensPower).od) && (
                                                            <div className="bg-white/50 p-2 rounded-xl border border-white">
                                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Right (OD)</p>
                                                                <p className="text-[10px] font-bold text-gray-800 flex flex-wrap gap-1">
                                                                    <span>S:{(item.lensStats || item.lensPower).od.sph || '0.00'}</span>
                                                                    <span>C:{(item.lensStats || item.lensPower).od.cyl || '0.00'}</span>
                                                                    <span>A:{(item.lensStats || item.lensPower).od.axis || '0'}</span>
                                                                </p>
                                                            </div>
                                                        )}
                                                        {((item.lensStats || item.lensPower).os) && (
                                                            <div className="bg-white/50 p-2 rounded-xl border border-white">
                                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Left (OS)</p>
                                                                <p className="text-[10px] font-bold text-gray-800 flex flex-wrap gap-1">
                                                                    <span>S:{(item.lensStats || item.lensPower).os.sph || '0.00'}</span>
                                                                    <span>C:{(item.lensStats || item.lensPower).os.cyl || '0.00'}</span>
                                                                    <span>A:{(item.lensStats || item.lensPower).os.axis || '0'}</span>
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {((item.lensStats || item.lensPower).pd) && (
                                                        <div className="mt-3 flex items-center gap-2 px-1">
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pupillary Distance:</p>
                                                            <span className="text-[10px] font-black italic text-blue-600">{(item.lensStats || item.lensPower).pd}mm</span>
                                                        </div>
                                                    )}

                                                    {((item.lensStats || item.lensPower).prescriptionImage) && (
                                                        <div className="mt-4 pt-4 border-t border-blue-100 flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-lg border border-blue-200 overflow-hidden bg-white">
                                                                    <img src={`http://localhost:5001/${(item.lensStats || item.lensPower).prescriptionImage}`} className="w-full h-full object-cover opacity-60" />
                                                                </div>
                                                                <p className="text-[8px] font-bold text-gray-500 uppercase leading-tight italic">Image Evidence<br />Provided by User</p>
                                                            </div>
                                                            <Link
                                                                href={`http://localhost:5001/${(item.lensStats || item.lensPower).prescriptionImage}`}
                                                                target="_blank"
                                                                className="h-9 px-4 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                                            >
                                                                <Eye className="w-3 h-3" /> View Rx
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-6 border-t border-dashed space-y-4">
                                <div className="flex justify-between text-xs font-black uppercase italic text-gray-900">
                                    <span>Shipping Final</span>
                                    <span>₹{viewingOrder.totalPrice}</span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Delivery Coordinates</p>
                                    <p className="text-[11px] font-bold text-gray-800 leading-relaxed">{viewingOrder.shippingAddress.address}, {viewingOrder.shippingAddress.city}, {viewingOrder.shippingAddress.postalCode}</p>
                                </div>
                            </div>
                            {viewingOrder.orderStatus === 'Pending' && (
                                <button onClick={() => { handleShipOrder(viewingOrder._id); setViewingOrder(null); }} className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-200">Initiate Shipment</button>
                            )}
                            {viewingOrder.orderStatus === 'Shipped' && (
                                <button onClick={() => { handleDeliverOrder(viewingOrder._id); setViewingOrder(null); }} className="w-full h-14 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-200">Confirm Delivery</button>
                            )}
                            {viewingOrder.orderStatus === 'Delivered' && (
                                <div className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 italic">Transaction Fully Fulfilled</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* BANNER MODAL (Add/Edit) */}
            {(showBannerModal || editingBanner) && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative border border-gray-100 p-10 overflow-y-auto max-h-[90vh]">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900">{editingBanner ? 'Update Banner' : 'New Banner'}</h2>
                            <button onClick={() => { setShowBannerModal(false); setEditingBanner(null); }} className="w-12 h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center justify-center"><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={editingBanner ? handleEditBannerSubmit : handleAddBanner} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Hero Title</label>
                                <input required className="input-modern" value={editingBanner ? editingBanner.title : newBanner.title} onChange={e => editingBanner ? setEditingBanner({ ...editingBanner, title: e.target.value }) : setNewBanner({ ...newBanner, title: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Subtitle / Offer</label>
                                <input className="input-modern" value={editingBanner ? editingBanner.subtitle : newBanner.subtitle} onChange={e => editingBanner ? setEditingBanner({ ...editingBanner, subtitle: e.target.value }) : setNewBanner({ ...newBanner, subtitle: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Target Link</label>
                                    <input className="input-modern" value={editingBanner ? editingBanner.link : newBanner.link} onChange={e => editingBanner ? setEditingBanner({ ...editingBanner, link: e.target.value }) : setNewBanner({ ...newBanner, link: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Sequence Order</label>
                                    <input type="number" className="input-modern" value={editingBanner ? (editingBanner.order || 0) : (newBanner.order || 0)} onChange={e => {
                                        const val = parseInt(e.target.value) || 0;
                                        editingBanner ? setEditingBanner({ ...editingBanner, order: val }) : setNewBanner({ ...newBanner, order: val });
                                    }} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Banner Visuals</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative group">
                                        <label htmlFor="banner-upload" className="cursor-pointer block">
                                            <div className="aspect-[21/9] rounded-[24px] bg-gray-50 border-2 border-dashed border-gray-100 overflow-hidden flex flex-col items-center justify-center relative p-2 group-hover:border-primary/30 transition-all">
                                                {(editingBanner?.image || newBanner.image) ? (
                                                    <>
                                                        <img src={(editingBanner || newBanner).image?.startsWith('/uploads/') ? `http://localhost:5001${(editingBanner || newBanner).image}` : (editingBanner || newBanner).image} className="w-full h-full object-cover rounded-[20px]" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                            <span className="bg-white text-black px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">New Asset</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-3 text-center">
                                                        {uploading ? (
                                                            <Sparkles className="w-8 h-8 text-primary animate-spin" />
                                                        ) : (
                                                            <Upload className="w-8 h-8 text-gray-300" />
                                                        )}
                                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">
                                                            {uploading ? 'Finalizing...' : 'Upload Image'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                        <input type="file" id="banner-upload" className="hidden" onChange={(e) => uploadBannerFileHandler(e, !!editingBanner)} />
                                    </div>
                                    <div className="flex flex-col justify-end space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Direct Link (or Auto-Generated)</label>
                                        <input
                                            required
                                            className="input-modern"
                                            placeholder="Paste URL or upload image"
                                            value={editingBanner ? editingBanner.image : newBanner.image}
                                            onChange={e => editingBanner ? setEditingBanner({ ...editingBanner, image: e.target.value }) : setNewBanner({ ...newBanner, image: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full h-16 bg-black text-white rounded-[24px] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-gray-800 transition-all mt-4 shadow-2xl shadow-black/20">
                                {editingBanner ? 'Save Changes' : 'Launch Banner'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}

            {(showCategoryModal || editingCategory) && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative border border-gray-100 p-10 overflow-y-auto max-h-[90vh]">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900">{editingCategory ? 'Update Taxonomy' : 'Build Category'}</h2>
                            <button onClick={() => { setShowCategoryModal(false); setEditingCategory(null); }} className="w-12 h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center justify-center"><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={editingCategory ? handleEditCategorySubmit : handleAddCategory} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Archive Name</label>
                                    <input required placeholder="e.g. Men, Women, Kids" className="input-modern" value={editingCategory ? editingCategory.name : newCategory.name} onChange={e => editingCategory ? setEditingCategory({ ...editingCategory, name: e.target.value }) : setNewCategory({ ...newCategory, name: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Unit Typology</label>
                                    <select className="input-modern" value={editingCategory ? editingCategory.type : newCategory.type} onChange={e => editingCategory ? setEditingCategory({ ...editingCategory, type: e.target.value }) : setNewCategory({ ...newCategory, type: e.target.value })}>
                                        <option>Eyeglasses</option>
                                        <option>Sunglasses</option>
                                        <option>Contact Lenses</option>
                                        <option>Accessories</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Market Tag (Price Text)</label>
                                    <input placeholder="e.g. Starts @₹500" className="input-modern" value={editingCategory ? editingCategory.priceText : newCategory.priceText} onChange={e => editingCategory ? setEditingCategory({ ...editingCategory, priceText: e.target.value }) : setNewCategory({ ...newCategory, priceText: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Sequence Order</label>
                                    <input type="number" className="input-modern" value={editingCategory ? editingCategory.order : newCategory.order} onChange={e => {
                                        const val = parseInt(e.target.value) || 0;
                                        editingCategory ? setEditingCategory({ ...editingCategory, order: val }) : setNewCategory({ ...newCategory, order: val });
                                    }} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Category Visual</label>
                                <div className="relative group">
                                    <label htmlFor="category-upload" className="cursor-pointer block">
                                        <div className="aspect-[2/1] rounded-[24px] bg-gray-50 border-2 border-dashed border-gray-100 overflow-hidden flex flex-col items-center justify-center relative p-2 group-hover:border-primary/30 transition-all">
                                            {(editingCategory?.image || newCategory.image) ? (
                                                <>
                                                    <img src={(editingCategory || newCategory).image?.startsWith('/uploads/') ? `http://localhost:5001${(editingCategory || newCategory).image}` : (editingCategory || newCategory).image} className="w-full h-full object-cover rounded-[20px]" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                        <span className="bg-white text-black px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">New Asset</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center gap-3 text-center">
                                                    {uploading ? (
                                                        <Sparkles className="w-8 h-8 text-primary animate-spin" />
                                                    ) : (
                                                        <Upload className="w-8 h-8 text-gray-300" />
                                                    )}
                                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">
                                                        {uploading ? 'Processing Visual...' : 'Upload Representation'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                    <input type="file" id="category-upload" className="hidden" onChange={(e) => uploadCategoryFileHandler(e, !!editingCategory)} />
                                </div>
                                <input
                                    required
                                    className="input-modern"
                                    placeholder="Or paste asset URL here..."
                                    value={editingCategory ? editingCategory.image : newCategory.image}
                                    onChange={e => editingCategory ? setEditingCategory({ ...editingCategory, image: e.target.value }) : setNewCategory({ ...newCategory, image: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full h-16 bg-black text-white rounded-[24px] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-gray-800 transition-all mt-4 shadow-2xl shadow-black/20">
                                {editingCategory ? 'Commit Update' : 'Initialize Category'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}

            <style jsx>{`
                .input-modern {
                    width: 100%;
                    padding: 1rem 1.25rem;
                    background-color: #F9FAFB;
                    border: 1px solid #F3F4F6;
                    border-radius: 1.25rem;
                    outline: none;
                    font-size: 0.875rem;
                    font-weight: 700;
                    transition: all 0.2s;
                }
                .input-modern:focus {
                    background-color: white;
                    border-color: #000;
                    box-shadow: 0 0 0 4px rgba(0,0,0,0.03);
                }
            `}</style>
        </div>
    );
}

