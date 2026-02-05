import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [showShopDropdown, setShowShopDropdown] = useState(false);
    const [showMobileShopDropdown, setShowMobileShopDropdown] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cartCount, setCartCount] = useState(0);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('userInfo'));

    const currentAudience = searchParams.get('audience');
    const currentProductType = searchParams.get('productType');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('http://localhost:5002/api/categories');
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchWishlist = async () => {
            if (user && user.token) {
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const { data } = await axios.get('http://localhost:5002/api/users/profile', config);
                    const ids = (data.wishlist || []).filter(p => p !== null).map(p => p._id);
                    localStorage.setItem('wishlistIds', JSON.stringify(ids));
                } catch (error) {
                    console.error('Error fetching wishlist:', error);
                }
            }
        };

        const updateCartCount = () => {
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const count = cartItems.reduce((acc, item) => acc + item.qty, 0);
            setCartCount(count);
        };

        fetchCategories();
        fetchWishlist();
        updateCartCount();

        window.addEventListener('storage', updateCartCount);
        window.addEventListener('cartUpdate', updateCartCount);

        return () => {
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('cartUpdate', updateCartCount);
        };
    }, []);

    const audienceCategories = categories.filter(c => c.type === 'audience');
    const productTypeCategories = categories.filter(c => c.type === 'form');

    const getLink = (type, id) => {
        const params = new URLSearchParams(searchParams);
        if (id) {
            params.set(type, id);
        } else {
            params.delete(type);
        }
        return `/products?${params.toString()}`;
    };

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?keyword=${searchQuery}`);
            setShowSearch(false);
            setSearchQuery('');
        } else if (showSearch) {
            setShowSearch(false);
        }
    };

    return (
        <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 flex-shrink-0">
                            <img
                                src="/assets/images/logo.png"
                                alt="Purevit"
                                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-[8px] sm:text-sm font-light tracking-wider text-gray-500">its</span>
                            <span className="text-xl sm:text-4xl font-serif font-bold tracking-tight">
                                <span className="text-purevit-dark">Pure</span>
                                <span className="text-purevit-primary">vit</span>
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8 md:space-x-12">
                        <Link to="/" className="text-[9px] md:text-xs font-black uppercase tracking-[0.16em] md:tracking-[0.2em] text-gray-500 hover:text-purevit-primary transition-all">Home</Link>

                        {/* Shop with Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setShowShopDropdown(true)}
                            onMouseLeave={() => setShowShopDropdown(false)}
                        >
                            <Link to="/products" className={`text-[9px] md:text-xs font-black uppercase tracking-[0.16em] md:tracking-[0.2em] transition-all flex items-center gap-1 py-8 ${(currentAudience || currentProductType) ? 'text-purevit-primary' : 'text-gray-500 hover:text-purevit-primary'}`}>
                                Shop
                                <ChevronDown size={12} className={`transition-transform duration-500 ${showShopDropdown ? 'rotate-180' : ''}`} />
                            </Link>

                            <AnimatePresence>
                                {showShopDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 w-[500px] bg-white border border-gray-100 rounded-2xl shadow-2xl p-8 z-50"
                                    >
                                        <Link
                                            to="/products"
                                            className="block font-serif italic text-lg text-purevit-dark hover:text-purevit-primary transition mb-6 pb-4 border-b border-gray-100"
                                            onClick={() => {
                                                setShowShopDropdown(false);
                                            }}
                                        >
                                            Shop All
                                        </Link>
                                        <div className="grid grid-cols-2 gap-10">
                                            {/* By Audience Type */}
                                            <div className="space-y-4">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">By Audience</span>
                                                <div className="flex flex-col space-y-2">
                                                    <Link
                                                        to={getLink('audience', '')}
                                                        className={`text-sm font-bold transition ${!currentAudience ? 'text-purevit-primary' : 'text-gray-500 hover:text-purevit-dark'}`}
                                                        onClick={() => setShowShopDropdown(false)}
                                                    >
                                                        All
                                                    </Link>
                                                    {audienceCategories.map(aud => (
                                                        <Link
                                                            key={aud._id}
                                                            to={getLink('audience', aud._id)}
                                                            className={`text-sm font-bold transition ${currentAudience === aud._id ? 'text-purevit-primary' : 'text-gray-500 hover:text-purevit-dark'}`}
                                                            onClick={() => setShowShopDropdown(false)}
                                                        >
                                                            {aud.name}
                                                        </Link>
                                                    ))}
                                                    {audienceCategories.length === 0 && <span className="text-xs text-gray-400">None defined</span>}
                                                </div>
                                            </div>
                                            {/* By Product Type */}
                                            <div className="space-y-4">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">By Product Type</span>
                                                <div className="flex flex-col space-y-2">
                                                    <Link
                                                        to={getLink('productType', '')}
                                                        className={`text-sm font-bold transition ${!currentProductType ? 'text-purevit-primary' : 'text-gray-500 hover:text-purevit-dark'}`}
                                                        onClick={() => setShowShopDropdown(false)}
                                                    >
                                                        All
                                                    </Link>
                                                    {productTypeCategories.map(pt => (
                                                        <Link
                                                            key={pt._id}
                                                            to={getLink('productType', pt._id)}
                                                            className={`text-sm font-bold transition ${currentProductType === pt._id ? 'text-purevit-primary' : 'text-gray-500 hover:text-purevit-dark'}`}
                                                            onClick={() => setShowShopDropdown(false)}
                                                        >
                                                            {pt.name}
                                                        </Link>
                                                    ))}
                                                    {productTypeCategories.length === 0 && <span className="text-xs text-gray-400">None defined</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link to="/customized-solution" className="text-[9px] md:text-xs font-black uppercase tracking-[0.16em] md:tracking-[0.2em] text-gray-500 hover:text-purevit-primary transition-all flex items-center gap-2">
                            Customized Solution
                        </Link>
                        <Link to="/about" className="text-[9px] md:text-xs font-black uppercase tracking-[0.16em] md:tracking-[0.2em] text-gray-500 hover:text-purevit-primary transition-all">Our Story</Link>
                        <Link to="/contact" className="text-[9px] md:text-xs font-black uppercase tracking-[0.16em] md:tracking-[0.2em] text-gray-500 hover:text-purevit-primary transition-all">Contact</Link>
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-7">
                        <div className="relative flex items-center">
                            <AnimatePresence>
                                {showSearch && (
                                    <motion.form
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 240, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        onSubmit={handleSearch}
                                        className="absolute right-full mr-4 overflow-hidden"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 text-xs font-bold outline-none focus:border-purevit-primary transition-all shadow-sm"
                                            autoFocus
                                        />
                                    </motion.form>
                                )}
                            </AnimatePresence>
                            <button
                                onClick={() => showSearch ? handleSearch() : setShowSearch(true)}
                                className="text-purevit-dark hover:text-purevit-primary transition-colors"
                            >
                                <Search size={18} />
                            </button>
                        </div>
                        <Link to="/cart" className="relative text-purevit-dark hover:text-purevit-primary transition-colors">
                            <ShoppingBag size={18} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-purevit-primary text-black text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.role === 'admin' && (
                                    <Link to="/admin/dashboard" className="text-[10px] font-black uppercase tracking-widest text-purevit-primary hover:text-purevit-dark transition-colors">
                                        Admin
                                    </Link>
                                )}
                                <Link to="/dashboard" className="text-purevit-dark hover:text-purevit-primary transition-colors">
                                    <User size={18} />
                                </Link>
                            </div>
                        ) : (
                            <Link to="/login" className="px-6 py-2.5 bg-purevit-dark text-white rounded-md hover:bg-black transition-all text-[10px] font-black uppercase tracking-widest">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-purevit-dark p-2">
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-y-auto max-h-[80vh]"
                    >
                        <div className="px-4 py-6 space-y-4 flex flex-col">
                            <Link to="/" className="text-sm text-gray-500 hover:text-purevit-primary" onClick={() => setIsOpen(false)}>Home</Link>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setShowMobileShopDropdown(!showMobileShopDropdown)}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 w-full"
                                >
                                    <span>Shop</span>
                                    <ChevronDown size={12} className={`transition-transform duration-300 ${showMobileShopDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {showMobileShopDropdown && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="space-y-2 overflow-y-auto max-h-[50vh]"
                                        >
                                            <Link to="/products" className="text-sm text-gray-500 hover:text-purevit-primary block" onClick={() => setIsOpen(false)}>Shop All</Link>
                                            {audienceCategories.length > 0 && (
                                                <div className="pl-2 space-y-1">
                                                    <span className="text-xs text-gray-500">By Audience</span>
                                                    {audienceCategories.map(aud => (
                                                        <Link key={aud._id} to={`/products?audience=${aud._id}`} className="block text-sm text-gray-400 hover:text-purevit-primary" onClick={() => setIsOpen(false)}>{aud.name}</Link>
                                                    ))}
                                                </div>
                                            )}
                                            {productTypeCategories.length > 0 && (
                                                <div className="pl-2 space-y-1">
                                                    <span className="text-xs text-gray-500">By Product Type</span>
                                                    {productTypeCategories.map(pt => (
                                                        <Link key={pt._id} to={`/products?productType=${pt._id}`} className="block text-sm text-gray-400 hover:text-purevit-primary" onClick={() => setIsOpen(false)}>{pt.name}</Link>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <Link to="/customized-solution" className="text-sm text-gray-500 hover:text-purevit-primary font-bold" onClick={() => setIsOpen(false)}>
                                Customized Solution
                            </Link>
                            <Link to="/about" className="text-sm text-gray-500 hover:text-purevit-primary" onClick={() => setIsOpen(false)}>Our Story</Link>
                            <Link to="/contact" className="text-sm text-gray-500 hover:text-purevit-primary" onClick={() => setIsOpen(false)}>Contact</Link>
                            <Link to="/cart" className="text-sm text-gray-500 hover:text-purevit-primary" onClick={() => setIsOpen(false)}>Cart</Link>
                            <Link to="/login" className="text-sm text-purevit-primary" onClick={() => setIsOpen(false)}>Login</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
