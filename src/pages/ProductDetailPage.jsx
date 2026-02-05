import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import {
    ShoppingBag, Heart, Share2, Star,
    Truck, ShieldCheck, Clock, RefreshCcw,
    MapPin, ChevronRight, Play, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState('benefits');
    const [pincode, setPincode] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [mainImage, setMainImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`);
                setProduct(data);
                setMainImage(data.images[0]);
                if (data.variants && data.variants.length > 0) {
                    setSelectedSize(data.variants[0]);
                } else {
                    setSelectedSize({ unitCount: data.unitCount, unitName: data.unitName });
                }

                const { data: related } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products?limit=6`);
                setRelatedProducts(related.filter(p => p._id !== id).slice(0, 4));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const addToCartHandler = () => {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const existingItem = cartItems.find(x => x.product === product._id);

        if (existingItem) {
            existingItem.qty += qty;
        } else {
            cartItems.push({
                product: product._id,
                name: product.name,
                image: product.images[0],
                price: product.price,
                size: `${selectedSize.unitCount} ${selectedSize.unitName}`,
                qty
            });
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        window.dispatchEvent(new Event('cartUpdate'));
        alert('Added to Cart');
    };

    const handleAddToWishlist = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            alert('Please login to add to wishlist');
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/wishlist`, { productId: product._id }, config);
            setIsLiked(true);

            const stored = JSON.parse(localStorage.getItem('wishlistIds')) || [];
            if (!stored.includes(product._id)) {
                localStorage.setItem('wishlistIds', JSON.stringify([...stored, product._id]));
            }

            alert('Added to wishlist!');
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (product) {
            const stored = JSON.parse(localStorage.getItem('wishlistIds')) || [];
            if (stored.includes(product._id)) {
                setIsLiked(true);
            }
        }
    }, [product]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: product.name, text: product.shortDescription, url: window.location.href });
            } catch (err) { console.log('Share failed:', err); }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white text-purevit-primary">
            <div className="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!product) return <div className="text-center py-20">Product not found</div>;

    const savingsPercent = product.discountPrice > product.price
        ? Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)
        : 0;

    const trustPoints = [
        { icon: <Truck size={20} />, label: 'Free Delivery', sub: 'On all orders' },
        { icon: <ShieldCheck size={20} />, label: 'Secure Payment', sub: '100% Protected' },
        { icon: <Clock size={20} />, label: '60 Hrs Shop', sub: 'Fast Support' },
        { icon: <RefreshCcw size={20} />, label: 'Easy Returns', sub: '7 Day Policy' },
    ];

    const benefitVisuals = (product.detailedBenefits && product.detailedBenefits.length > 0) ? product.detailedBenefits.map(b => ({
        title: b.title, desc: b.description,
        icon: <Star className={b.iconType === 'rose' ? 'text-rose-500' : 'text-purevit-primary'} />,
        bgColor: b.iconType === 'rose' ? 'bg-rose-50' : 'bg-purevit-primary/5',
        borderColor: b.iconType === 'rose' ? 'border-rose-100' : 'border-purevit-primary/10'
    })) : [
        { title: 'Overall Health', desc: 'Nourishment of 23 vital vitamins and minerals.', icon: <Star className="text-blue-500" />, bgColor: 'bg-blue-50', borderColor: 'border-blue-100' },
        { title: 'Glow & Radiance', desc: 'Plant based Hyaluronate for glowing skin.', icon: <Star className="text-rose-500" />, bgColor: 'bg-rose-50', borderColor: 'border-rose-100' },
        { title: 'Healthy Immunity', desc: 'Vitamin C, D3, B12 and Zinc support.', icon: <Star className="text-purevit-primary" />, bgColor: 'bg-purevit-primary/5', borderColor: 'border-purevit-primary/10' }
    ];

    return (
        <div className="bg-[#fafbfc] min-h-screen pb-20 mt-16 md:mt-24">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest overflow-hidden">
                        <Link to="/" className="hover:text-purevit-primary transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <Link to="/products" className="hover:text-purevit-primary transition-colors">Shop</Link>
                        <ChevronRight size={12} />
                        <span className="text-gray-900 truncate">{product.name}</span>
                    </div>
                    <button onClick={handleShare} className="p-2 md:p-3 bg-white rounded-full shadow-sm border border-gray-100 text-gray-400 hover:text-purevit-primary transition-all flex-shrink-0">
                        <Share2 size={18} />
                    </button>
                </div>
            </div>

            <section className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Image Gallery */}
                        <div className="p-6 md:p-12 bg-[#fbfcfd] border-b lg:border-b-0 lg:border-r border-gray-50 text-center">
                            <div className="sticky top-24 space-y-8">
                                <div className="aspect-square bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-inner p-4 flex items-center justify-center">
                                    <img src={mainImage} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                    {product.images.map((img, idx) => (
                                        <button key={idx} onClick={() => setMainImage(img)} className={`w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 transition-all p-2 bg-white flex-shrink-0 ${mainImage === img ? 'border-purevit-primary ring-2 ring-purevit-primary/10' : 'border-gray-100'}`}>
                                            <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="p-6 md:p-12 space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-purevit-primary/10 text-purevit-primary text-[10px] font-black uppercase tracking-widest rounded-lg">PureVit Choice</span>
                                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-600 rounded-lg text-[10px] font-bold">
                                        <Star size={12} className="fill-current" /> {product.rating || '4.8'}
                                    </div>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-serif font-medium text-purevit-dark leading-tight">{product.name}</h1>
                                <p className="text-gray-400 text-sm md:text-base leading-relaxed italic">{product.shortDescription}</p>
                            </div>

                            <div className="flex flex-wrap items-end gap-6">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-purevit-primary uppercase tracking-widest mb-1 block">Our Price</span>
                                    <span className="text-4xl md:text-5xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                                </div>
                                {product.discountPrice > product.price && (
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">M.R.P</span>
                                        <span className="text-gray-400 line-through text-xl md:text-2xl font-medium">₹{product.discountPrice.toLocaleString()}</span>
                                    </div>
                                )}
                                {savingsPercent > 0 && (
                                    <div className="px-4 py-2 bg-purevit-primary text-white font-black text-xs uppercase rounded-xl shadow-lg shadow-purevit-primary/20">SAVE {savingsPercent}%</div>
                                )}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-50">
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest block">Select Pack Size</span>
                                <div className="flex flex-wrap gap-3">
                                    {(product.variants && product.variants.length > 0 ? product.variants : [{ unitCount: product.unitCount, unitName: product.unitName }]).map((variant, idx) => (
                                        <button key={idx} onClick={() => setSelectedSize(variant)} className={`px-6 py-3 rounded-xl font-bold text-xs transition-all border-2 ${selectedSize.unitCount === variant.unitCount ? 'bg-purevit-dark border-purevit-dark text-white' : 'bg-white border-gray-100 text-gray-600 hover:border-purevit-primary'}`}>
                                            {variant.unitCount} {variant.unitName}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-gray-50">
                                {trustPoints.map((point, idx) => (
                                    <div key={idx} className="space-y-1 text-center">
                                        <div className="w-10 h-10 bg-purevit-primary/5 rounded-xl flex items-center justify-center text-purevit-primary mx-auto">{point.icon}</div>
                                        <p className="text-[9px] font-black text-gray-900 uppercase tracking-tight">{point.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 pt-4">
                                <div className="flex items-center justify-between md:justify-start bg-gray-50 p-2 rounded-xl border border-gray-100 md:w-32">
                                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center font-bold text-lg">-</button>
                                    <span className="w-10 text-center font-black text-gray-900">{qty}</span>
                                    <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center font-bold text-lg">+</button>
                                </div>
                                <button onClick={addToCartHandler} className="flex-1 bg-purevit-primary text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-purevit-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-transform">
                                    <ShoppingBag size={18} /> Add to Cart • ₹{(product.price * qty).toLocaleString()}
                                </button>
                                <button
                                    onClick={handleAddToWishlist}
                                    className={`w-12 h-14 border-2 rounded-xl flex items-center justify-center transition-all ${isLiked ? 'text-red-500 border-red-100 bg-red-50' : 'text-gray-400 border-gray-100 hover:text-rose-500 hover:border-rose-100'}`}
                                >
                                    <Heart size={20} className={isLiked ? "fill-current" : ""} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
                <div className="flex justify-center border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar">
                    <div className="flex gap-8">
                        {['benefits', 'ingredients', 'usage'].map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative ${activeTab === tab ? 'text-purevit-primary' : 'text-gray-400'}`}>
                                {tab} {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-purevit-primary rounded-full" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-6 md:p-12 border border-gray-100 min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'benefits' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {benefitVisuals.map((b, i) => (
                                    <div key={i} className={`p-8 rounded-3xl border-2 ${b.borderColor} ${b.bgColor} space-y-4`}>
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">{b.icon}</div>
                                        <h3 className="text-xl font-bold text-gray-900">{b.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                        {/* More tabs could be filled but keeping it concise for now */}
                        {activeTab !== 'benefits' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 text-sm md:text-base leading-relaxed">
                                {activeTab === 'ingredients' ? (product.ingredients?.join(', ') || 'Multivitamins, Minerals, Essential Amino acids') : (product.usageInstructions || 'Take one tablet daily with water after your main meal.')}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Related Products Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
                <div className="mb-10 px-4">
                    <span className="text-purevit-primary text-[10px] font-black uppercase tracking-[0.3em] block mb-2">Shop Complementary</span>
                    <h2 className="text-3xl md:text-5xl font-serif font-medium text-purevit-dark">You May Also Like</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 px-4">
                    {relatedProducts.map((p) => (
                        <ProductCard key={p._id} product={p} onAddToCart={() => { }} onAddToWishlist={() => { }} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ProductDetailPage;
