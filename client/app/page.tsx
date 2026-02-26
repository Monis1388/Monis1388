"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, Home as HomeIcon, LayoutGrid, RotateCw, ShoppingBag, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import BannerCarousel from '../components/BannerCarousel';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, bannersRes, categoriesRes] = await Promise.all([
          api.get('products'),
          api.get('banners'),
          api.get('categories')
        ]);
        setProducts(productsRes.data.products || []);
        setBanners(bannersRes.data || []);
        setDbCategories(categoriesRes.data || []);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sections = [
    {
      title: "Eyeglasses",
      badge: "with Power",
      items: dbCategories.filter(c => c.type === 'Eyeglasses').length > 0
        ? dbCategories.filter(c => c.type === 'Eyeglasses')
        : [
          { name: "Men", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80" },
          { name: "Women", image: "https://images.unsplash.com/photo-1591010885068-07e110cb1624?w=800&q=80" },
          { name: "Kids", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80" },
          { name: "On Sale", image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80", priceText: "Starts @₹500" }
        ]
    },
    {
      title: "Sunglasses",
      items: dbCategories.filter(c => c.type === 'Sunglasses').length > 0
        ? dbCategories.filter(c => c.type === 'Sunglasses')
        : [
          { name: "Men", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80" },
          { name: "Women", image: "https://images.unsplash.com/photo-1544717297-fa15bdfca03c?w=800&q=80" },
          { name: "Kids", image: "https://images.unsplash.com/photo-1503910368127-b459492c5ae0?w=800&q=80" },
          { name: "On Sale", image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80", priceText: "Starts @₹500" }
        ]
    }
  ];

  return (
    <div className="flex flex-col gap-8 pb-32 bg-[#FBFBFB]">
      {/* Hero Banner Section */}
      <section className="px-4 pt-4">
        {loading ? (
          <div className="h-[240px] md:h-[400px] bg-gray-200 rounded-3xl animate-pulse" />
        ) : (
          <BannerCarousel banners={banners} />
        )}
      </section>

      {/* Dynamic Category Sections */}
      {sections.map((section: any, sIdx: number) => (
        <section key={sIdx} className="px-4 space-y-4">
          <div className="flex items-center gap-3 ml-2">
            <h2 className="text-2xl font-black text-gray-900">{section.title}</h2>
            {section.badge && (
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold border border-blue-100 uppercase tracking-tighter">
                {section.badge}
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {section.items.map((item: any, iIdx: number) => (
              <Link
                key={iIdx}
                href={`/shop?category=${section.title}&gender=${item.name}`}
                className="group flex flex-col items-center gap-2"
              >
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 group-hover:shadow-md transition-all">
                  <img src={item.image?.startsWith('/uploads/') ? `http://localhost:5001${item.image}` : item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 text-[10px] font-black text-gray-900 bg-white/60 backdrop-blur-sm px-2 py-0.5 rounded-md uppercase tracking-tighter">
                    {item.name}
                  </div>
                  {item.priceText && (
                    <div className="absolute bottom-0 left-0 bg-primary text-white px-2 py-0.5 rounded-tr-lg text-[8px] font-black italic">
                      {item.priceText}
                    </div>
                  )}
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-primary">{item.name}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Featured Collection Section */}
      <section className="px-4 space-y-4">
        <div className="flex items-center justify-between ml-2">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            New Arrivals
          </h2>
          <Link href="/shop" className="text-primary font-bold text-sm">View All</Link>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
          {loading ? (
            [1, 2, 3, 4].map(i => <div key={i} className="min-w-[200px] h-64 bg-gray-100 rounded-3xl animate-pulse" />)
          ) : (
            products.slice(0, 6).map((product: any) => (
              <div key={product._id} className="min-w-[220px]">
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-gray-100 flex items-center justify-around px-2 z-[100] shadow-[0_-8px_30px_rgb(0,0,0,0.04)] sm:hidden">
        {[
          { icon: HomeIcon, label: "Home", active: true },
          { icon: LayoutGrid, label: "Category" },
          { icon: RotateCw, label: "TryAtHome" },
          { icon: ShoppingBag, label: "Orders" },
          { icon: UserIcon, label: "Profile" }
        ].map((item, idx) => (
          <button key={idx} className={`flex flex-col items-center gap-1 min-w-[64px] ${item.active ? 'text-primary' : 'text-gray-400'}`}>
            <item.icon className={`w-5 h-5 ${item.active ? 'fill-primary/10' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
