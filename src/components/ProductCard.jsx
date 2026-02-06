import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductCard = ({ product, onAddToCart, onAddToWishlist, activeBadge }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Calculate savings percentage
    const savingsPercent = product.discountPrice > product.price
        ? Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)
        : 0;

    // Format rating (e.g., 4.5)
    const displayRating = product.rating || 4.2;
    const displayReviews = product.numReviews ? (product.numReviews >= 1000 ? `${(product.numReviews / 1000).toFixed(1)}k` : product.numReviews) : '1.2k';

    // Badge Logic: Prioritize activeBadge if passed, otherwise use a priority list
    const renderBadge = () => {
        const badges = {
            bestseller: {
                condition: product.isBestSeller,
                label: 'Bestseller',
                color: 'bg-[#f59e0b]'
            },
            featured: {
                condition: product.isFeatured,
                label: 'featured',
                color: 'bg-[#8b5cf6]'
            },
            newlaunch: {
                condition: product.isNewLaunch,
                label: 'New launches',
                color: 'bg-purevit-primary'
            },
            supersaver: {
                condition: product.isSuperSaver,
                label: 'Super Saver',
                color: 'bg-[#f43f5e]'
            }
        };

        // If activeBadge is passed and valid, show it
        if (activeBadge && badges[activeBadge]?.condition) {
            const b = badges[activeBadge];
            return (
                <div className={`px-2 py-0.5 md:px-4 md:py-1.5 ${b.color} text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1 md:gap-1.5`}>
                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full animate-pulse" />
                    {b.label}
                </div>
            );
        }

        // Otherwise show only the highest priority badge that is true
        // Priority: Super Saver > Bestseller > New Launch > Featured
        const priorityOrder = ['supersaver', 'bestseller', 'newlaunch', 'featured'];
        for (const key of priorityOrder) {
            if (badges[key].condition) {
                const b = badges[key];
                return (
                    <div className={`px-2 py-0.5 md:px-4 md:py-1.5 ${b.color} text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1 md:gap-1.5`}>
                        <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full animate-pulse" />
                        {b.label}
                    </div>
                );
            }
        }
        return null;
    };

    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('wishlistIds')) || [];
        if (stored.includes(product._id)) {
            setIsWishlisted(true);
        }
    }, [product._id]);

    const handleWishlistClick = (e) => {
        e.preventDefault();
        onAddToWishlist(product._id);
        setIsWishlisted(!isWishlisted);
    };

    // ... handleShare logic remains ...
    const handleShare = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.shortDescription,
                    url: `${window.location.origin}/products/${product._id}`,
                });
            } catch (err) {
                console.log('Share failed:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(`${window.location.origin}/products/${product._id}`);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <motion.div
            className="group relative bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 snap-start w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Image Section */}
            <div className="aspect-[5/4] bg-[#f8f9fb] relative overflow-hidden p-4 group-hover:p-3 transition-all duration-500">
                <Link to={`/products/${product._id}`}>
                    {(product.primaryMedia === 'video' || (!product.primaryMedia && !product.images?.[0] && product.videoUrl)) && product.videoUrl ? (
                        <video
                            src={product.videoUrl}
                            poster={product.images && product.images[0]}
                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                            muted
                            loop
                            playsInline
                            autoPlay
                        />
                    ) : (
                        <img
                            src={product.images && product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                        />
                    )}
                </Link>

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {renderBadge()}
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full shadow-sm border border-gray-100 flex items-center gap-1">
                    <span className="text-[11px] font-bold text-gray-900">{displayRating}</span>
                    <Star size={10} className="fill-purevit-primary text-purevit-primary" />
                    <div className="w-[1px] h-2 bg-gray-200 mx-0.5" />
                    <span className="text-[9px] text-gray-500 font-medium">{displayReviews}</span>
                </div>

                {/* Quick Action Bar (Wishlist & Share) - Always Visible */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 transition-transform duration-500">
                    <button
                        onClick={handleWishlistClick}
                        className={`p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm transition active:scale-95 border border-gray-100 ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-rose-500 hover:scale-110'}`}
                    >
                        <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
                    </button>
                    <button
                        onClick={handleShare}
                        className="p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-gray-400 hover:text-purevit-primary hover:scale-110 transition active:scale-95 border border-gray-100"
                    >
                        <Share2 size={18} />
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-2 pt-2 md:p-4 md:pt-3">
                {/* Brand & Title */}
                <div className="hidden md:flex items-center gap-2 mb-2">
                    <div className="px-2 py-0.5 bg-purevit-primary/10 text-purevit-primary rounded text-[9px] font-bold uppercase tracking-wider border border-purevit-primary/10">
                        {product.brand || 'PureVit'}
                    </div>
                </div>

                <Link to={`/products/${product._id}`}>
                    <h3 className="text-[10px] md:text-sm font-bold text-gray-900 mb-0.5 leading-tight md:h-9 line-clamp-2 group-hover:text-purevit-primary transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <p className="hidden md:block text-gray-400 text-[10px] font-medium mb-3 h-7 line-clamp-2 leading-tight">
                    {product.shortDescription || 'Crafted for essential daily wellness.'}
                </p>

                {/* Pricing Block */}
                <div className="flex flex-col gap-0.5 mb-2 md:mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm md:text-lg font-outfit font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                        {product.discountPrice > product.price && (
                            <span className="text-gray-400 line-through text-[9px] md:text-[11px] font-medium">MRP: ₹{product.discountPrice.toLocaleString()}</span>
                        )}
                        {savingsPercent > 0 && (
                            <div className="hidden md:block px-1.5 py-0.5 bg-green-50 text-green-600 font-black text-[8px] uppercase rounded border border-green-100">
                                {savingsPercent}% OFF
                            </div>
                        )}
                    </div>

                    <div className="text-[9px] md:text-[10px] font-medium text-gray-400">
                        (₹{(product.price / (product.unitCount || 50)).toFixed(2)} / {product.unitName?.slice(0, -1) || 'unit'})
                    </div>
                </div>

                {/* Size Pill */}
                <div className="hidden md:block mb-4">
                    <div className="inline-flex items-center px-3 py-1.5 bg-[#FAF9F6] border border-orange-100/40 rounded-full text-purevit-dark text-[10px] font-black uppercase tracking-wider shadow-sm">
                        <div className="w-1 h-1 bg-green-500 rounded-full mr-1.5 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                        {product.unitCount || 50} {product.unitName || 'Tabs'}
                    </div>
                </div>

                {/* Bottom Action */}
                <button
                    onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
                    className="w-full relative py-1.5 md:py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-black uppercase tracking-widest text-[10px] overflow-hidden group/btn transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
                >
                    <div className="relative z-10 flex items-center justify-center gap-1.5">
                        <ShoppingCart size={14} className="fill-white" />
                        <span>Add to Cart</span>
                    </div>
                    <div className="absolute inset-0 bg-black/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </button>
            </div>
        </motion.div>
    );
};

export default ProductCard;
