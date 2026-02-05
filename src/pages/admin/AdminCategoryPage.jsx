import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Tag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminCategoryPage = () => {
    const [categories, setCategories] = useState([]);

    const [catName, setCatName] = useState('');
    const [catDesc, setCatDesc] = useState('');
    const [catType, setCatType] = useState('audience');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [isTypeOpen, setIsTypeOpen] = useState(false);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const submitMainCategory = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
                }
            };
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/categories`, {
                name: catName,
                description: catDesc,
                type: catType || 'general',
                parent: null
            }, config);

            setMessage({ type: 'success', text: `${catType === 'audience' ? 'Audience Type' : 'Product Type'} created!` });
            setCatName('');
            setCatDesc('');
            setCatType('audience');
            fetchCategories();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || error.message });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure? This will not delete products.')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
                    }
                };
                await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/categories/${id}`, config);
                fetchCategories();
            } catch (error) {
                alert(error.response?.data?.message || error.message);
            }
        }
    };

    const audienceCategories = categories.filter(c => c.type === 'audience');
    const productTypeCategories = categories.filter(c => c.type === 'form');

    return (
        <div className="p-3 md:p-8 max-w-[1600px] mx-auto space-y-6 md:space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-serif font-bold text-purevit-dark tracking-tight leading-tight">Audience & Product Type</h1>
                    <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">Manage Types and Classifications</p>
                </div>
            </header>

            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-red-50 border-red-200 text-red-700'
                            } fixed top-24 right-8 z-50 shadow-xl`}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="font-bold">{message.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-8">
                {/* Create Form */}
                <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                            <Tag size={20} className="md:w-6 md:h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-2xl font-bold uppercase tracking-tight text-purevit-dark">Create New</h2>
                            <p className="text-[9px] md:text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">Category or Classification</p>
                        </div>
                    </div>

                    <form onSubmit={submitMainCategory} className="bg-white border border-purevit-primary/10 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm space-y-4 max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            <div className="space-y-1.5 md:space-y-2">
                                <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Type</label>
                                <div className="relative">
                                    <div
                                        onClick={() => setIsTypeOpen(!isTypeOpen)}
                                        className="w-full bg-purevit-secondary border border-purevit-primary/15 rounded-xl px-4 py-2.5 md:py-3 text-[10px] md:text-xs text-purevit-dark flex items-center overflow-hidden cursor-pointer relative h-[38px] md:h-[42px]"
                                    >
                                        <motion.div
                                            animate={{ x: [0, -100, 0] }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 8,
                                                ease: "linear"
                                            }}
                                            className="whitespace-nowrap pr-20"
                                        >
                                            {catType === 'audience'
                                                ? 'Audience Type (Men, Women, Kids)'
                                                : 'Product Type (Supplement, etc.)'}
                                        </motion.div>
                                    </div>
                                    <AnimatePresence>
                                        {isTypeOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute top-full left-0 w-full bg-white border border-purevit-primary/10 rounded-xl mt-1 shadow-xl z-50 py-1.5"
                                            >
                                                <div
                                                    onClick={() => { setCatType('audience'); setIsTypeOpen(false); }}
                                                    className={`px-4 py-2 hover:bg-purevit-cream text-[10px] md:text-xs text-purevit-dark cursor-pointer ${catType === 'audience' ? 'bg-purevit-cream font-bold' : ''}`}
                                                >
                                                    Audience Type
                                                </div>
                                                <div
                                                    onClick={() => { setCatType('form'); setIsTypeOpen(false); }}
                                                    className={`px-4 py-2 hover:bg-purevit-cream text-[10px] md:text-xs text-purevit-dark cursor-pointer ${catType === 'form' ? 'bg-purevit-cream font-bold' : ''}`}
                                                >
                                                    Product Type
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            <div className="space-y-1.5 md:space-y-2">
                                <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Name</label>
                                <input
                                    type="text"
                                    value={catName}
                                    onChange={(e) => setCatName(e.target.value)}
                                    placeholder={catType === 'audience' ? 'e.g. Men' : 'e.g. Powder'}
                                    className="w-full bg-purevit-secondary border border-purevit-primary/15 rounded-xl px-4 py-2.5 md:py-3 text-xs md:text-sm text-purevit-dark focus:bg-white outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5 md:space-y-2 md:col-span-2 lg:col-span-1">
                                <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                                <input
                                    type="text"
                                    value={catDesc}
                                    onChange={(e) => setCatDesc(e.target.value)}
                                    placeholder="Optional description..."
                                    className="w-full bg-purevit-secondary border border-purevit-primary/15 rounded-xl px-4 py-2.5 md:py-3 text-xs md:text-sm text-purevit-dark focus:bg-white outline-none transition-all"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-purevit-primary hover:bg-purevit-dark text-white rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-all shadow-md active:scale-95"
                        >
                            + Create New Category
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <div>
                        <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 px-2 mb-3 flex items-center gap-2">
                            <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-purple-500" />
                            Audience Types
                        </h4>
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 md:gap-3">
                            {audienceCategories.map(cat => (
                                <div key={cat._id} className="bg-white border border-purevit-primary/10 rounded-xl p-2.5 md:p-3 flex items-center justify-between group hover:border-purple-400 transition-all shadow-sm">
                                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                        <Tag size={12} className="text-purple-500 flex-shrink-0" />
                                        <span className="font-bold text-[11px] md:text-sm text-purevit-dark truncate">{cat.name}</span>
                                    </div>
                                    <button type="button" onClick={() => deleteHandler(cat._id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                                        <Trash2 size={12} className="md:w-3.5 md:h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 px-2 mb-3 flex items-center gap-2">
                            <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-emerald-500" />
                            Product Types
                        </h4>
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 md:gap-3">
                            {productTypeCategories.map(cat => (
                                <div key={cat._id} className="bg-white border border-purevit-primary/10 rounded-xl p-2.5 md:p-3 flex items-center justify-between group hover:border-emerald-400 transition-all shadow-sm">
                                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                        <Tag size={12} className="text-emerald-500 flex-shrink-0" />
                                        <span className="font-bold text-[11px] md:text-sm text-purevit-dark truncate">{cat.name}</span>
                                    </div>
                                    <button type="button" onClick={() => deleteHandler(cat._id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                                        <Trash2 size={12} className="md:w-3.5 md:h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCategoryPage;
