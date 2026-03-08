"use client";
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';

export default function Profile() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');

    // Profile Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else {
            setName(user.name);
            setEmail(user.email);
            fetchOrders();
        }
    }, [user, router]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/myorders');
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateProfileHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            try {
                const { data } = await api.put('/users/profile', { id: user?._id, name, email, password });
                setMessage('Profile Updated');
                // Update local storage/context if needed
            } catch (error: any) {
                setMessage(error.response?.data?.message || 'Update failed');
            }
        }
    };

    const handlePrescriptionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('prescription', file);

        try {
            await api.post('/users/upload-prescription', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Prescription uploaded successfully!');
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        }
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-1/4 card h-fit">
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl text-primary font-bold">
                        {user?.name.charAt(0)}
                    </div>
                    <h2 className="font-bold">{user?.name}</h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div className="space-y-2">
                    <button onClick={() => setActiveTab('orders')} className={`w-full text-left px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-muted'}`}>My Orders</button>
                    <button onClick={() => setActiveTab('profile')} className={`w-full text-left px-4 py-2 rounded ${activeTab === 'profile' ? 'bg-primary text-white' : 'hover:bg-muted'}`}>Profile Settings</button>
                    <button onClick={() => setActiveTab('prescription')} className={`w-full text-left px-4 py-2 rounded ${activeTab === 'prescription' ? 'bg-primary text-white' : 'hover:bg-muted'}`}>My Prescriptions</button>
                    <button onClick={() => { logout(); router.push('/login'); }} className="w-full text-left px-4 py-2 rounded text-red-500 hover:bg-red-50">Logout</button>
                </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-3/4">
                {activeTab === 'orders' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Order History</h2>
                        {orders.length === 0 ? <p>No orders found.</p> : (
                            <div className="space-y-4">
                                {orders.map((order: any) => (
                                    <div key={order._id} className="card">
                                        <div className="flex justify-between items-center mb-4 pb-4 border-b">
                                            <div>
                                                <div className="font-bold">Order #{order._id.substring(0, 10)}...</div>
                                                <div className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.orderStatus}
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div className="font-black italic text-xl text-primary">₹{order.totalPrice.toLocaleString()}</div>
                                            {order.trackingId && (
                                                <a
                                                    href={`https://www.delhivery.com/track/package/${order.trackingId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 bg-[#EAF4FF] text-[#4DA6FF] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#4DA6FF] hover:text-white transition-all border border-[#4DA6FF]/20"
                                                >
                                                    Track Order <Package className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="card max-w-lg">
                        <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                        {message && <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4">{message}</div>}
                        <form onSubmit={updateProfileHandler} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Passowrd</label>
                                <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep same" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                                <input type="password" className="input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-primary">Update Profile</button>
                        </form>
                    </div>
                )}

                {activeTab === 'prescription' && (
                    <div className="card max-w-lg">
                        <h2 className="text-2xl font-bold mb-6">My Prescriptions</h2>
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Upload New Prescription</label>
                            <input type="file" onChange={handlePrescriptionUpload} className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-primary/10 file:text-primary
                            hover:file:bg-primary/20
                        "/>
                            <p className="text-xs text-muted-foreground mt-1">Supported formats: JPG, PNG, PDF</p>
                        </div>
                        {user?.savedPrescriptions && user.savedPrescriptions.length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-2">Saved Files</h3>
                                <ul className="list-disc ml-5">
                                    {user.savedPrescriptions.map((path: string, i: number) => (
                                        <li key={i}><a href={`http://localhost:5000/${path}`} target="_blank" className="text-primary underline">View Prescription {i + 1}</a></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
