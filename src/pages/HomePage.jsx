import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReelCard from '../components/ReelCard';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';

const HomePage = () => {
    const [bestSellers, setBestSellers] = useState([]);
    const [newLaunches, setNewLaunches] = useState([]);
    const [superSavers, setSuperSavers] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [reels, setReels] = useState([]);
    const [audienceCats, setAudienceCats] = useState([]);
    const [formCats, setFormCats] = useState([]);

    const addToCart = (product) => {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const existItem = cartItems.find((x) => x.product === product._id);

        let newItems;
        if (existItem) {
            newItems = cartItems.map((x) =>
                x.product === product._id ? { ...x, qty: x.qty + 1 } : x
            );
        } else {
            newItems = [...cartItems, {
                product: product._id,
                name: product.name,
                image: product.images[0],
                price: product.price,
                qty: 1
            }];
        }

        localStorage.setItem('cartItems', JSON.stringify(newItems));
        alert('${product.name} added to cart!');
        window.dispatchEvent(new Event('cartUpdate'));
    };

    const handleAddToWishlist = async (productId) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            alert('Please login to manage wishlist');
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/wishlist`, { productId }, config);

            const stored = JSON.parse(localStorage.getItem('wishlistIds')) || [];
            if (data.action === 'added') {
                if (!stored.includes(productId)) {
                    localStorage.setItem('wishlistIds', JSON.stringify([...stored, productId]));
                }
                alert('Item added to wishlist!');
            } else if (data.action === 'removed') {
                const newStored = stored.filter(id => id !== productId);
                localStorage.setItem('wishlistIds', JSON.stringify(newStored));
                alert('Item removed from wishlist!');
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error updating wishlist');
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch Best Sellers
                const { data: bestSellersData } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products?isBestSeller=true`);
                setBestSellers(bestSellersData.slice(0, 8));

                // Fetch New Launches
                const { data: newLaunchesData } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products?isNewLaunch=true`);
                setNewLaunches(newLaunchesData.slice(0, 8));

                // Fetch Super Savers
                const { data: superSaversData } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products?isSuperSaver=true`);
                setSuperSavers(superSaversData.slice(0, 8));

                // Fetch Featured Products
                const { data: featuredData } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products?isFeatured=true`);
                setFeaturedProducts(featuredData.slice(0, 8));
            } catch (err) {
                console.log("Error fetching products", err);
            }

            // Fetch Categories
            try {
                const { data: cats } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
                setAudienceCats(cats.filter(c => c.type === 'audience'));
                setFormCats(cats.filter(c => c.type === 'form'));
            } catch (err) {
                console.log(`Error fetching categories`, err);
            }

            // Fetch Reels
            try {
                const { data: reelsData } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/reels`);
                setReels(reelsData.slice(0, 8));
            } catch (err) {
                console.log("No reels found or API error", err);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen overflow-x-hidden">
            {/* Hero Section */}
            <HeroCarousel />

            {/* Benefits Section */}
            <section className="py-12 md:py-20 bg-white relative overflow-hidden">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-purevit-primary/5 blur-[90px] rounded-full pointer-events-none"></div>
                <div className="absolute -bottom-32 -right-24 w-[420px] h-[420px] bg-purevit-secondary/40 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="space-y-4 max-w-2xl">
                            <span className="text-purevit-primary text-[10px] font-black uppercase tracking-[0.45em]">Trust Markers</span>
                            <h2 className="text-3xl md:text-5xl font-serif text-purevit-dark font-medium leading-[1.2]">
                                Clean. Clinical. Crafted for Daily Rituals.
                            </h2>
                        </div>
                        <div className="hidden md:flex items-center gap-3">
                            <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-purevit-dark bg-purevit-beige/70 border border-purevit-primary/10">
                                Purevit Standard
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            { title: "100% Organic", desc: "Sourced from sustainable farms globally." },
                            { title: "Lab Tested", desc: "Certified for therapeutic purity and potency." },
                            { title: "Eco-Friendly", desc: "100% recyclable amber glass packaging." }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="group relative rounded-[2rem] border border-purevit-primary/10 bg-white shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                            >
                                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-purevit-cream via-white to-purevit-cream/60"></div>
                                <div className="absolute right-6 top-6 text-[10px] font-black uppercase tracking-[0.45em] text-purevit-primary/70">
                                    0{idx + 1}
                                </div>
                                <div className="relative p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center text-purevit-dark">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div className="text-[10px] uppercase tracking-[0.35em] text-purevit-dark/70 font-black">Verified</div>
                                    </div>
                                    <h3 className="mt-6 text-xl font-serif font-medium text-purevit-dark">{item.title}</h3>
                                    <p className="mt-2 text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Watch & Shop (Reels) */}
            <section className="py-12 md:py-20 bg-purevit-cream border-y border-purevit-primary/10">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="mb-12">
                        <span className="text-purevit-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Community</span>
                        <h2 className="text-3xl md:text-6xl font-serif text-purevit-dark font-medium">Watch & Shop</h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {reels.length > 0 ? reels.map((reel) => (
                            <ReelCard key={reel._id} reel={reel} />
                        )) : (
                            [1, 2, 3, 4].map((_, idx) => (
                                <div key={idx} className="aspect-[9/16] bg-white rounded-3xl flex items-center justify-center border border-purevit-primary/10">
                                    <p className="text-purevit-muted text-[10px] uppercase tracking-widest font-bold">No Reels</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Shop by Audience */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-8">
                        <span className="text-purevit-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">The Collections</span>
                        <h2 className="text-3xl md:text-5xl font-serif text-purevit-dark font-medium">Shop by Category</h2>
                        <div className="h-px w-24 bg-purevit-primary mx-auto mt-6 opacity-30"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {(audienceCats.length > 0 ? audienceCats : [
                            { name: 'Women', _id: 'women', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80' },
                            { name: 'Men', _id: 'men', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80' },
                            { name: 'Kids', _id: 'kids', image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80' },
                            { name: 'Senior', _id: 'senior', image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80' }
                        ]).map((cat) => (
                            <Link key={cat._id} to={`/products?audience=${cat._id}`} className="group flex flex-col items-center gap-4">
                                <div className="w-24 h-24 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-transparent group-hover:border-purevit-primary transition-all duration-500 shadow-lg">
                                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                </div>
                                <span className="text-base md:text-xl font-serif text-purevit-dark font-medium">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Formats */}
            <section className="py-12 md:py-20 bg-purevit-cream border-y border-purevit-primary/5">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="mb-12">
                        <span className="text-purevit-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">The Formulations</span>
                        <h2 className="text-3xl md:text-6xl font-serif text-purevit-dark font-medium italic">Product Formats</h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {formCats.length > 0 ? formCats.map((cat, idx) => (
                            <Link key={cat._id} to={`/products?productType=${cat._id}`} className="group">
                                <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-purevit-primary/10">
                                    <div className="aspect-[1/1] md:aspect-[16/10] overflow-hidden bg-white">
                                        <img src={cat.image || `https://images.unsplash.com/photo-1594489428504-5c0c480a3202?auto=format&fit=crop&q=80&sig=${idx}`} alt={cat.name} className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105" />
                                    </div>
                                    <div className="px-4 py-3 border-t border-purevit-primary/10">
                                        <h3 className="text-[11px] md:text-base font-semibold text-purevit-dark">{cat.name}</h3>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            [1, 2, 3, 4].map((_, idx) => (
                                <div key={idx} className="aspect-[16/10] rounded-[2rem] bg-white border border-dashed border-purevit-primary/20 flex items-center justify-center">
                                    <span className="text-purevit-muted text-[10px] font-black uppercase tracking-widest">0{idx + 1}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Product Sections (Featured, Best Seller, New, Saver) */}
            {[
                { title: "Featured Products", data: featuredProducts, badge: "featured" },
                { title: "Best Sellers", data: bestSellers, badge: "bestseller", bg: "bg-[#f9fafb]" },
                { title: "New Launches", data: newLaunches, badge: "newlaunch" },
                { title: "Super Saver", data: superSavers, badge: "supersaver", bg: "bg-[#f9fafb]" }
            ].map((section, sIdx) => (
                <section key={sIdx} className={`py-12 md:py-20 ${section.bg || 'bg-white'}`}>
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-black">{section.title}</h2>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                            {section.data.length > 0 ? section.data.map((product) => (
                                <ProductCard key={product._id} product={product} activeBadge={section.badge} onAddToCart={addToCart} onAddToWishlist={handleAddToWishlist} />
                            )) : (
                                [1, 2, 3, 4].map((i) => (
                                    <div key={i} className="aspect-[3/4] bg-white rounded-3xl border border-dashed border-gray-200 flex items-center justify-center">
                                        <p className="text-gray-400 text-xs">No Products</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="mt-12 flex justify-center">
                            <Link to="/products" className="inline-flex items-center gap-3 px-8 py-3 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                                View Collection <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </section>
            ))}

            {/* Learn Section */}
            <section className="py-12 md:py-20 bg-[#fcfbf9] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div className="space-y-4">
                            <span className="text-purevit-primary text-[10px] font-black uppercase tracking-[0.4em]">Knowledge Base</span>
                            <h2 className="text-3xl md:text-7xl font-serif text-purevit-dark font-medium italic">Discover & Learn</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                        {[
                            { slug: "science-of-bioavailability", title: "The Science of Bio-Availability", desc: "How Purevit ensures maximum absorption of every nutrient.", image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80" },
                            { slug: "personalized-wellness", title: "Personalized Nutrition", desc: "Why one size does not fit all in health and energy.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80" },
                            { slug: "pharmaceutical-standards", title: "Purity Above All Else", desc: "How we verify every batch for contaminants, potency, and compliance.", image: "https://images.unsplash.com/photo-1581594549595-35f6edc7b762?auto=format&fit=crop&q=80" }
                        ].map((item, idx) => (
                            <Link key={idx} to={`/learn/${item.slug}`} className="group bg-white rounded-[2rem] overflow-hidden shadow-lg hover:-translate-y-2 transition-all duration-500">
                                <div className="h-48 md:h-64 overflow-hidden relative">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                </div>
                                <div className="p-5 md:p-8">
                                    <h3 className="text-lg md:text-2xl font-serif text-purevit-dark leading-tight group-hover:text-purevit-primary transition-colors">{item.title}</h3>
                                    <p className="mt-3 text-sm text-gray-400 line-clamp-2">{item.desc}</p>
                                    <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-black group-hover:text-purevit-primary transition-colors">
                                        Learn More <ArrowRight size={12} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
