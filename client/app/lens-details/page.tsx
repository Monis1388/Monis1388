"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight, Glasses, ShieldCheck, Square, ArrowLeft,
    CheckCircle2, Sparkles, Zap, FileUp, Save, Upload,
    Check, AlertCircle, ShoppingBag, Eye, User
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

function LensDetailsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const productId = searchParams.get('productId');

    const [product, setProduct] = useState<any>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedLens, setSelectedLens] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [uploading, setUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [powerData, setPowerData] = useState({
        od: { sph: '', cyl: '', axis: '', add: '' },
        os: { sph: '', cyl: '', axis: '', add: '' },
        pd: '',
        prescriptionImage: '',
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (productId && productId.length === 24) {
            api.get(`products/${productId}`)
                .then(({ data }) => setProduct(data))
                .catch(err => {
                    console.error('Error fetching product in lens-details', err);
                    setError("Could not load product details.");
                });
        }
    }, [productId]);

    const steps = [
        { id: 1, title: 'Power Type' },
        { id: 2, title: 'Lenses' },
        { id: 3, title: 'Add Power' }
    ];

    const powerTypes = [
        {
            id: 'single-vision',
            title: 'Single Vision With Power',
            description: 'Positive, Negative or Cylindrical',
            tag: 'PREPAID',
            icon: (
                <div className="relative">
                    <Glasses className="w-10 h-10 text-blue-600" />
                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                        <div className="flex flex-col items-center justify-center text-[8px] font-black leading-none text-blue-600">
                            <span>+</span>
                            <span className="-mt-1">/</span>
                            <span className="-mt-1">-</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'zero-power',
            title: 'Zero Power',
            description: 'Blue light block for screen protection',
            tag: 'PREPAID',
            icon: (
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-400/20 blur-xl animate-pulse rounded-full" />
                    <Glasses className="w-10 h-10 text-emerald-500 relative z-10" />
                </div>
            )
        },
        {
            id: 'frame-only',
            title: 'Frame Only',
            description: 'With no lenses',
            tag: 'COD AVAILABLE',
            tagColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            icon: (
                <div className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <Square className="w-6 h-6 text-gray-400" />
                </div>
            )
        }
    ];

    const lensPackages = [
        { id: 'anti-glare', name: 'Anti-Glare', desc: 'Eliminates reflections, night driving', price: 500, icon: <Sparkles className="w-8 h-8 text-amber-500" /> },
        { id: 'blue-cut', name: 'Blue-Cut', desc: 'Protects from screen light', price: 700, icon: <Zap className="w-8 h-8 text-blue-500" /> },
        { id: 'photochromic', name: 'Photochromic', desc: 'Transitions in sunlight', price: 1000, icon: <ShieldCheck className="w-8 h-8 text-purple-500" /> }
    ];

    const validatePower = () => {
        if (selectedType === 'frame-only' || selectedType === 'zero-power') return true;
        const { od, os, prescriptionImage } = powerData;
        if (prescriptionImage) return true;
        return (od.sph || od.cyl) && (os.sph || os.cyl);
    };

    const handlePowerInput = (eye: 'od' | 'os', field: string, value: string) => {
        setPowerData(prev => ({
            ...prev,
            [eye]: { ...prev[eye], [field]: value }
        }));
        setError(null);
    };

    const handleSavePower = () => {
        if (validatePower()) {
            alert("Prescription details locked and saved for this session.");
            setError(null);
        } else {
            setError("Please enter power values or upload a prescription image.");
        }
    };

    const addToCartHandler = async () => {
        if (!product) {
            setError("Product data not loaded. Please refresh.");
            return;
        }
        if (!user) {
            router.push(`/login?redirect=/lens-details?productId=${productId}`);
            return;
        }

        if (!validatePower()) {
            setError("Please enter prescription details to continue.");
            return;
        }

        setIsSaving(true);
        try {
            await api.post('users/cart', {
                productId: product._id,
                name: product.name,
                image: product.image,
                price: product.price + (selectedLens?.price || 0),
                qty: 1,
                lensPower: {
                    ...powerData,
                    lensType: selectedLens?.name || 'Default'
                }
            });
            router.push('/cart');
        } catch (err) {
            console.error(err);
            setError("Failed to save. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePrescriptionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!user) {
            router.push(`/login?redirect=/lens-details?productId=${productId}`);
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('prescription', file);

        try {
            const { data } = await api.post('users/upload-prescription', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setPowerData(prev => ({ ...prev, prescriptionImage: data.filePath }));
            alert("Prescription uploaded successfully!");
        } catch (err) {
            alert("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FBFBFB] pb-32">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-900 transition-all active:scale-95">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Add Lens Details</h1>
                    </div>
                </div>
                {product && (
                    <div className="flex items-center gap-2">
                        <img src={product.image.startsWith('/uploads/') ? `http://localhost:5001${product.image}` : product.image} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-[10px] font-black uppercase text-gray-400 truncate max-w-[80px]">{product.name}</span>
                    </div>
                )}
            </header>

            {/* Step Progress Bar */}
            <div className="bg-white px-6 py-8 border-b border-gray-100 shadow-sm relative z-40">
                <div className="flex items-center justify-between max-w-sm mx-auto relative">
                    <div className="absolute top-4 left-0 right-0 h-[2px] bg-gray-100 -z-0" />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep - 1) * 50}%` }}
                        className="absolute top-4 left-0 h-[2px] bg-blue-600 -z-0"
                    />

                    {steps.map((step) => (
                        <button
                            key={step.id}
                            onClick={() => {
                                if (step.id < currentStep) setCurrentStep(step.id);
                                else if (step.id === 2 && selectedType) setCurrentStep(2);
                                else if (step.id === 3 && selectedLens) setCurrentStep(3);
                            }}
                            className="flex flex-col items-center gap-2 relative z-10 disabled:opacity-50"
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${step.id === currentStep
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-4 ring-blue-50'
                                : step.id < currentStep
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-white border border-gray-200 text-gray-400'
                                }`}>
                                {step.id < currentStep ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${step.id === currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                                {step.title}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 max-w-xl">
                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="mb-8">
                                <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">Select Power Type</h2>
                                <p className="text-gray-400 text-sm font-bold italic">Step 1: Choose how you'll use your frames</p>
                            </div>
                            <div className="grid gap-4">
                                {powerTypes.map((type) => (
                                    <div
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={`p-6 rounded-[2.5rem] bg-white border-2 cursor-pointer transition-all ${selectedType === type.id ? 'border-blue-600 shadow-2xl shadow-blue-500/10 scale-[1.02]' : 'border-gray-50 hover:border-blue-200'}`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`p-5 rounded-[1.5rem] transition-all ${selectedType === type.id ? 'bg-blue-50' : 'bg-gray-50'}`}>{type.icon}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{type.title}</h3>
                                                    <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${type.tagColor || 'bg-blue-50 text-blue-600 border-blue-100'}`}>{type.tag}</span>
                                                </div>
                                                <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">{type.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="mb-8">
                                <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">Choose Lens Package</h2>
                                <p className="text-gray-400 text-sm font-bold italic">Step 2: Add essential coatings for eyes</p>
                            </div>
                            <div className="grid gap-4">
                                {lensPackages.map((lens) => (
                                    <div
                                        key={lens.id}
                                        onClick={() => setSelectedLens(lens)}
                                        className={`p-6 rounded-[2.5rem] bg-white border-2 cursor-pointer transition-all ${selectedLens?.id === lens.id ? 'border-blue-600 shadow-2xl shadow-blue-500/10 scale-[1.02]' : 'border-gray-50 hover:border-blue-200'}`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`p-5 rounded-[1.5rem] ${selectedLens?.id === lens.id ? 'bg-blue-50' : 'bg-gray-50'}`}>{lens.icon}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{lens.name}</h3>
                                                    <span className="text-lg font-black text-blue-600">₹{lens.price}</span>
                                                </div>
                                                <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">{lens.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="mb-8">
                                <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">Prescription Details</h2>
                                <p className="text-gray-400 text-sm font-bold italic text-blue-600 underline cursor-pointer flex items-center gap-2">
                                    <FileUp className="w-4 h-4" /> Help me read my prescription
                                </p>
                            </div>

                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-6">
                                <div className="p-6 space-y-8">
                                    {/* Right Eye (OD) */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">OD</div>
                                            <h4 className="font-black uppercase tracking-widest text-gray-900 italic">Right Eye</h4>
                                        </div>
                                        <div className="grid grid-cols-4 gap-3">
                                            {['sph', 'cyl', 'axis', 'add'].map(field => (
                                                <div key={field} className="space-y-1">
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block pl-1">{field}</label>
                                                    <input
                                                        type="text" placeholder="0.00"
                                                        value={powerData.od[field as keyof typeof powerData.od]}
                                                        onChange={(e) => handlePowerInput('od', field, e.target.value)}
                                                        className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-2 text-center font-bold focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="h-px bg-gray-50" />

                                    {/* Left Eye (OS) */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-black">OS</div>
                                            <h4 className="font-black uppercase tracking-widest text-gray-900 italic">Left Eye</h4>
                                        </div>
                                        <div className="grid grid-cols-4 gap-3">
                                            {['sph', 'cyl', 'axis', 'add'].map(field => (
                                                <div key={field} className="space-y-1">
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block pl-1">{field}</label>
                                                    <input
                                                        type="text" placeholder="0.00"
                                                        value={powerData.os[field as keyof typeof powerData.os]}
                                                        onChange={(e) => handlePowerInput('os', field, e.target.value)}
                                                        className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-2 text-center font-bold focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <div className="flex items-center justify-between mb-3 pl-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">Pupillary Distance (PD)</label>
                                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">Optional</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="text" placeholder="62mm"
                                                value={powerData.pd}
                                                onChange={(e) => { setPowerData(p => ({ ...p, pd: e.target.value })); setError(null); }}
                                                className="flex-1 h-14 bg-gray-900 text-white rounded-2xl px-6 font-black text-lg focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
                                            />
                                            <div className="p-4 bg-blue-50 rounded-2xl">
                                                <Eye className="w-6 h-6 text-blue-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex items-center justify-center gap-2 h-16 border-2 border-dashed border-gray-200 rounded-3xl font-black uppercase text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer">
                                    <input type="file" className="hidden" onChange={handlePrescriptionUpload} disabled={uploading} />
                                    {uploading ? "Uploading..." : <><Upload className="w-4 h-4" /> {powerData.prescriptionImage ? "Change Rx" : "Upload Rx"}</>}
                                </label>
                                <button onClick={handleSavePower} className="flex items-center justify-center gap-2 h-16 bg-white border-2 border-gray-100 rounded-3xl font-black uppercase text-xs text-gray-900 hover:border-blue-400 transition-all">
                                    <Save className="w-4 h-4" /> Save Power
                                </button>
                            </div>

                            {powerData.prescriptionImage && (
                                <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-emerald-200">
                                        <img src={`http://localhost:5001/${powerData.prescriptionImage}`} className="w-full h-full object-cover" alt="Prescription" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black uppercase text-emerald-700 tracking-widest">Prescription Image Attached</p>
                                        <p className="text-[9px] font-bold text-emerald-600/60 uppercase">Manual input below is now optional</p>
                                    </div>
                                    <Check className="w-5 h-5 text-emerald-500" />
                                </div>
                            )}

                            {error && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold">
                                    <AlertCircle className="w-4 h-4" /> {error}
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Floating Footer Action */}
            <div className="fixed bottom-0 left-0 right-0 p-6 z-[9999] pointer-events-none sm:px-12">
                <div className="max-w-xl mx-auto pointer-events-auto">
                    <AnimatePresence>
                        {selectedType && (
                            <motion.button
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                disabled={isSaving || !product || (selectedType !== 'frame-only' && currentStep === 2 && !selectedLens)}
                                onClick={() => {
                                    if (selectedType === 'frame-only') {
                                        addToCartHandler();
                                    } else if (currentStep < 3) {
                                        setCurrentStep(prev => prev + 1);
                                    } else {
                                        addToCartHandler();
                                    }
                                }}
                                className={`w-full h-18 py-5 rounded-[2.2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${(currentStep === 3 || selectedType === 'frame-only')
                                    ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-600'
                                    : 'bg-gray-900 text-white shadow-2xl shadow-gray-900/20 hover:bg-primary'
                                    } disabled:opacity-50 disabled:grayscale`}
                            >
                                {isSaving ? "Saving..." : selectedType === 'frame-only' ? (
                                    <>Add Frame to Bag <ShoppingBag className="w-5 h-5 ml-1" /></>
                                ) : currentStep === 1 ? (
                                    <>Next: Lenses <ChevronRight className="w-5 h-5" /></>
                                ) : currentStep === 2 ? (
                                    <>Next: Prescription <ChevronRight className="w-5 h-5" /></>
                                ) : (
                                    <>Finalize & Checkout <ShoppingBag className="w-5 h-5 ml-1" /></>
                                )}
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default function LensDetailsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" /></div>}>
            <LensDetailsContent />
        </Suspense>
    );
}
