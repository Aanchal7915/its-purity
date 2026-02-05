import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Filter, ArrowRight, Heart, ChevronRight, Search, SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        keyword: '',
        minPrice: '',
        maxPrice: '',
        audience: '',
        productType: '',
        sort: ''
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const [categories, setCategories] = useState([]);
    const user = JSON.parse(localStorage.getItem('userInfo'));

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('http://localhost:5002/api/categories');
            setCategories(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.keyword) queryParams.append('keyword', filters.keyword);
            if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
            if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
            if (filters.audience) queryParams.append('audience', filters.audience);
            if (filters.productType) queryParams.append('form', filters.productType);
            if (filters.sort) queryParams.append('sort', filters.sort);

            const { data } = await axios.get(`http://localhost:5002/api/products?${queryParams.toString()}`);
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchFiltersFromUrl = () => {
            const audienceId = searchParams.get('audience') || '';
            const productTypeId = searchParams.get('productType') || '';
            const keyword = searchParams.get('keyword') || '';
            const minPrice = searchParams.get('minPrice') || '';
            const maxPrice = searchParams.get('maxPrice') || '';
            const sort = searchParams.get('sort') || '';

            setFilters({
                keyword,
                minPrice,
                maxPrice,
                audience: audienceId,
                productType: productTypeId,
                sort
            });
        };

        fetchFiltersFromUrl();
    }, [searchParams]);

    useEffect(() => {
        fetchProducts();
    }, [filters.audience, filters.productType, filters.sort, filters.keyword, filters.minPrice, filters.maxPrice]);

    const handleApplyFilters = () => {
        const params = {};
        if (filters.audience) params.audience = filters.audience;
        if (filters.productType) params.productType = filters.productType;
        if (filters.keyword) params.keyword = filters.keyword;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.sort) params.sort = filters.sort;

        setSearchParams(params);
        setShowFilters(false);
    };

    const addToWishlist = async (productId) => {
        if (!user) {
            alert('Please login to add to wishlist');
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post('http://localhost:5002/api/users/wishlist', { productId }, config);

            const stored = JSON.parse(localStorage.getItem('wishlistIds')) || [];
            if (!stored.includes(productId)) {
                localStorage.setItem('wishlistIds', JSON.stringify([...stored, productId]));
            }

            alert('Added to wishlist!');
        } catch (error) {
            console.error(error);
            alert('Error adding to wishlist');
        }
    };

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
        window.dispatchEvent(new Event('cartUpdate'));
        alert(`${product.name} added to cart!`);
    };

    const updateFilterParam = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        setSearchParams(params);
    };

    return (
        <div className="min-h-screen bg-purevit-secondary pt-8 md:pt-12 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                            {filters.audience && (
                                <span className="text-purevit-primary text-[10px] font-black uppercase tracking-[0.2em] bg-white px-3 py-1 rounded-full shadow-sm border border-purevit-primary/5">
                                    {categories.find(c => c._id === filters.audience)?.name}
                                </span>
                            )}
                            {filters.productType && (
                                <>
                                    {filters.audience && <ChevronRight size={12} className="text-gray-300" />}
                                    <span className="text-purevit-dark text-[10px] font-black uppercase tracking-[0.2em] bg-white px-3 py-1 rounded-full shadow-sm border border-purevit-primary/5">
                                        {categories.find(c => c._id === filters.productType)?.name}
                                    </span>
                                </>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif text-purevit-dark leading-tight">
                            {filters.audience || filters.productType ? 'Choice Selection' : 'Daily Rituals'}
                        </h1>
                        <p className="text-gray-400 font-medium max-w-lg">Discover our laboratory-grade formulations crafted for your daily wellness journey.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <select
                                value={filters.sort}
                                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                                className="appearance-none bg-white border border-purevit-primary/5 rounded-2xl px-6 py-4 pr-12 text-sm font-bold text-purevit-dark focus:outline-none focus:ring-4 focus:ring-purevit-primary/10 shadow-lg cursor-pointer transition-all"
                            >
                                <option value="">Sort: Featured</option>
                                <option value="priceLow">Price: Low to High</option>
                                <option value="priceHigh">Price: High to Low</option>
                                <option value="newest">Newest Arrivals</option>
                            </select>
                            <SlidersHorizontal className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                        <button
                            onClick={() => setShowFilters(true)}
                            className="md:hidden w-14 h-14 bg-purevit-dark text-white rounded-2xl flex items-center justify-center hover:bg-black transition-all shadow-xl"
                        >
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10">

                    {/* Filter Sidebar */}
                    <aside className={`fixed inset-0 z-50 lg:static lg:z-auto lg:col-span-3 transition-all duration-500 ${showFilters ? 'opacity-100 pointer-events-auto' : 'opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto'}`}>
                        {/* Mobile Overlay */}
                        <div className="absolute inset-0 bg-purevit-dark/60 backdrop-blur-sm lg:hidden" onClick={() => setShowFilters(false)} />

                        <div className="relative h-full lg:h-auto w-[85%] lg:w-full bg-white lg:bg-transparent rounded-r-[3rem] lg:rounded-none p-10 lg:p-0 shadow-2xl lg:shadow-none overflow-y-auto">
                            <div className="lg:hidden flex items-center justify-between mb-10">
                                <h2 className="text-3xl font-serif text-purevit-dark">Refine</h2>
                                <button onClick={() => setShowFilters(false)} className="w-10 h-10 rounded-full bg-purevit-secondary/50 flex items-center justify-center text-gray-400">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-5 relative">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100/40 blur-[80px] rounded-full -mr-20 -mt-20"></div>
                                <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-50/60 blur-[60px] rounded-full -ml-20 -mb-20"></div>

                                {/* Search Section */}
                                <div className="bg-white rounded-2xl p-5 shadow-lg border border-orange-200/30 relative z-10">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-orange-600 ml-1 mb-3 block flex items-center gap-2">
                                        <div className="w-1 h-3 bg-orange-500 rounded-full"></div>
                                        Search Formulation
                                    </label>
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600/50 group-focus-within:text-green-600 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={filters.keyword}
                                            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-gradient-to-br from-orange-50/50 to-amber-50/40 border border-orange-200/40 rounded-2xl focus:bg-white focus:border-green-500 focus:shadow-lg transition-all outline-none font-medium text-purevit-dark text-xs hover:border-orange-300/50"
                                        />
                                    </div>
                                </div>

                                {/* Audience Focus Section */}
                                <div className="bg-white rounded-2xl p-5 shadow-lg border border-orange-200/30 relative z-10">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-orange-600 ml-1 mb-3 block flex items-center gap-2">
                                        <div className="w-1 h-3 bg-orange-500 rounded-full"></div>
                                        Audience Focus
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => updateFilterParam('audience', '')}
                                            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${!filters.audience ? 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-500/30 scale-105' : 'bg-gradient-to-br from-orange-50 to-amber-50 text-gray-500 hover:text-orange-700 hover:from-orange-100 hover:to-amber-100 hover:shadow-md'}`}
                                        >
                                            All Focus
                                        </button>
                                        {categories.filter(c => c.type === 'audience').map(aud => (
                                            <button
                                                key={aud._id}
                                                onClick={() => updateFilterParam('audience', aud._id)}
                                                className={`px-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${filters.audience === aud._id ? 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-500/30 scale-105' : 'bg-gradient-to-br from-orange-50 to-amber-50 text-gray-500 hover:text-orange-700 hover:from-orange-100 hover:to-amber-100 hover:shadow-md'}`}
                                            >
                                                {aud.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Dosage Form Section */}
                                <div className="bg-white rounded-2xl p-5 shadow-lg border border-orange-200/30 relative z-10">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-orange-600 ml-1 mb-3 block flex items-center gap-2">
                                        <div className="w-1 h-3 bg-orange-500 rounded-full"></div>
                                        Dosage Form
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => updateFilterParam('productType', '')}
                                            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${!filters.productType ? 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-500/30 scale-105' : 'bg-gradient-to-br from-orange-50 to-amber-50 text-gray-500 hover:text-orange-700 hover:from-orange-100 hover:to-amber-100 hover:shadow-md'}`}
                                        >
                                            All Types
                                        </button>
                                        {categories.filter(c => c.type === 'form').map(pt => (
                                            <button
                                                key={pt._id}
                                                onClick={() => updateFilterParam('productType', pt._id)}
                                                className={`px-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${filters.productType === pt._id ? 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-500/30 scale-105' : 'bg-gradient-to-br from-orange-50 to-amber-50 text-gray-500 hover:text-orange-700 hover:from-orange-100 hover:to-amber-100 hover:shadow-md'}`}
                                            >
                                                {pt.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Bracket Section */}
                                <div className="bg-white rounded-2xl p-5 shadow-lg border border-orange-200/30 relative z-10">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-orange-600 ml-1 mb-3 block flex items-center gap-2">
                                        <div className="w-1 h-3 bg-orange-500 rounded-full"></div>
                                        Price Bracket
                                    </label>
                                    <div className="flex gap-3">
                                        <input
                                            type="number"
                                            placeholder="₹ Min"
                                            value={filters.minPrice}
                                            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                            className="w-full px-4 py-3 bg-gradient-to-br from-orange-50/50 to-amber-50/40 border border-orange-200/40 rounded-xl outline-none font-outfit font-bold text-sm text-purevit-dark focus:bg-white focus:border-green-500 focus:shadow-lg transition-all hover:border-orange-300/50"
                                        />
                                        <input
                                            type="number"
                                            placeholder="₹ Max"
                                            value={filters.maxPrice}
                                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                            className="w-full px-4 py-3 bg-gradient-to-br from-orange-50/50 to-amber-50/40 border border-orange-200/40 rounded-xl outline-none font-outfit font-bold text-sm text-purevit-dark focus:bg-white focus:border-green-500 focus:shadow-lg transition-all hover:border-orange-300/50"
                                        />
                                    </div>
                                </div>

                                {/* Apply Button */}
                                <button
                                    onClick={handleApplyFilters}
                                    className="w-full group relative py-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] overflow-hidden transition-all duration-300 shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-600/40 hover:scale-[1.02] active:scale-[0.98] relative z-10"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <SlidersHorizontal size={14} />
                                        Apply Refinement
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-black to-purevit-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid Container */}
                    <main className="lg:col-span-9 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="aspect-[4/5] bg-white rounded-[2.5rem] animate-pulse shadow-lg border border-purevit-primary/5" />
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            onAddToCart={addToCart}
                                            onAddToWishlist={addToWishlist}
                                        />
                                    ))}
                                </div>
                                {products.length === 0 && (
                                    <div className="bg-white rounded-[4rem] p-20 md:p-32 text-center shadow-xl border border-purevit-primary/5">
                                        <div className="w-24 h-24 bg-purevit-cream rounded-full flex items-center justify-center mx-auto mb-10 text-gray-300">
                                            <Search size={44} />
                                        </div>
                                        <h2 className="text-4xl font-serif text-purevit-dark mb-4">No formulations found.</h2>
                                        <p className="text-gray-400 mb-0 font-medium max-w-sm mx-auto">Try adjusting your filters or search keywords to discover other wellness rituals.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;
