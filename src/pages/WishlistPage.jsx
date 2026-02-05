import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Heart, ArrowRight, ChevronLeft, ShieldCheck, XCircle } from 'lucide-react';

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const navigate = useNavigate();

    const fetchWishlist = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, config);
            const items = (data.wishlist || []).filter(p => p !== null);
            setWishlist(items);

            // Sync with localStorage cache for red heart icons across site
            localStorage.setItem('wishlistIds', JSON.stringify(items.map(p => p._id)));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/users/wishlist/${productId}`, config);
            const updatedWishlist = wishlist.filter(p => p._id !== productId);
            setWishlist(updatedWishlist);

            // Sync with localStorage
            localStorage.setItem('wishlistIds', JSON.stringify(updatedWishlist.map(p => p._id)));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (user) fetchWishlist();
        else navigate('/login?redirect=wishlist');
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-purevit-secondary flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purevit-primary/20 border-t-purevit-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-purevit-secondary py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="space-y-4">
                        <Link to="/products" className="flex items-center gap-2 text-gray-400 hover:text-purevit-dark font-bold text-[10px] uppercase tracking-[0.3em] transition-colors">
                            <ChevronLeft size={16} /> The Collections
                        </Link>
                        <h1 className="text-6xl font-serif text-purevit-dark leading-none">Your <span className="italic text-purevit-primary">Curated</span> <br />Selection.</h1>
                    </div>
                    <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md border border-white p-2 rounded-2xl">
                        <div className="px-6 py-4 bg-purevit-dark rounded-xl text-white">
                            <span className="block text-[8px] font-black uppercase tracking-widest opacity-50 mb-1">Items Saved</span>
                            <span className="text-xl font-serif font-bold">{wishlist.length}</span>
                        </div>
                    </div>
                </div>

                {wishlist.length === 0 ? (
                    <div className="bg-white rounded-[4rem] p-20 md:p-32 text-center shadow-2xl border border-purevit-primary/5 flex flex-col items-center">
                        <div className="w-24 h-24 bg-purevit-cream rounded-full flex items-center justify-center mb-10 text-purevit-primary shadow-inner">
                            <Heart size={44} />
                        </div>
                        <h2 className="text-4xl font-serif text-purevit-dark mb-6">Your wishlist is resting.</h2>
                        <p className="text-gray-400 mb-10 max-w-sm leading-relaxed font-medium">Capture the products you love and they will appear here, waiting for your next ritual.</p>
                        <Link
                            to="/products"
                            className="group relative px-12 py-5 bg-purevit-dark hover:bg-black text-white rounded-2xl font-black uppercase tracking-[0.25em] text-xs overflow-hidden transition-all duration-500 shadow-xl"
                        >
                            <span className="relative z-10 flex items-center gap-3">Start Collecting <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" /></span>
                            <div className="absolute inset-0 bg-purevit-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        {wishlist.filter(p => p !== null).map((product) => (
                            <div key={product._id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-purevit-primary/5 transition-all duration-700 hover:shadow-2xl hover:-translate-y-3">
                                <div className="aspect-[4/5] bg-purevit-cream relative overflow-hidden">
                                    <img
                                        src={product.images?.[0] || product.image || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80"}
                                        alt={product.name}
                                        className="w-full h-full object-cover mix-blend-multiply transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-purevit-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Action Buttons */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                        <Link
                                            to={`/products/${product._id}`}
                                            className="px-6 py-3 bg-white text-purevit-dark rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-purevit-primary hover:text-white transition-all whitespace-nowrap"
                                        >
                                            View Ritual
                                        </Link>
                                    </div>

                                    <button
                                        onClick={() => removeFromWishlist(product._id)}
                                        className="absolute top-6 right-6 w-11 h-11 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-90"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                </div>

                                <div className="p-8">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purevit-primary animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Available In Stock</span>
                                    </div>
                                    <h3 className="font-serif text-2xl text-purevit-dark mb-2 truncate group-hover:text-purevit-primary transition-colors">{product.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-purevit-primary font-black text-lg">₹{product.price}</p>
                                        <div className="text-[10px] font-bold text-gray-300 line-through">₹{Math.floor(product.price * 1.3)}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Message */}
                <div className="mt-24 pt-10 border-t border-purevit-primary/10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-purevit-primary shadow-sm">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                            Your selections are securely <br /> saved to your profile.
                        </div>
                    </div>
                    <Link to="/products" className="text-[10px] font-black uppercase tracking-[0.4em] text-purevit-dark hover:text-purevit-primary transition-colors">
                        Explore more formulations
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
