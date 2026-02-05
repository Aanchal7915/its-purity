import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, X, Plus, Trash, Upload, ArrowLeft, Check } from 'lucide-react';

const AdminProductEdit = () => {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [price, setPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [unitCount, setUnitCount] = useState(1);
    const [unitName, setUnitName] = useState('Piece');
    const [countInStock, setCountInStock] = useState(0);
    const [image, setImage] = useState('');
    const [images, setImages] = useState([]);
    const [isFeatured, setIsFeatured] = useState(false);
    const [isBestSeller, setIsBestSeller] = useState(false);
    const [isNewLaunch, setIsNewLaunch] = useState(false);
    const [isSuperSaver, setIsSuperSaver] = useState(false);

    const [detailedBenefits, setDetailedBenefits] = useState([]);
    const [ingredients, setIngredients] = useState('');
    const [usageInstructions, setUsageInstructions] = useState('');

    // Facet classifications
    const [targetAudience, setTargetAudience] = useState([]);
    const [productForm, setProductForm] = useState([]);

    const [packageSize, setPackageSize] = useState('');
    const [variants, setVariants] = useState([]);

    // Category Management
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        fetchCategories();
        if (isEditMode) {
            fetchProduct();
        }
    }, [id, isEditMode]);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('http://localhost:5002/api/categories');
            setCategories(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProduct = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5002/api/products/${id}`);
            setName(data.name);
            setSlug(data.slug);
            setPrice(data.price);
            setDiscountPrice(data.discountPrice || '');
            setBrand(data.brand || '');
            setImage(data.images?.[0] || '');
            setImages(data.images || []);
            setCountInStock(data.stock);
            setDescription(data.description);
            setShortDescription(data.shortDescription || '');
            setUnitCount(data.unitCount || 1);
            setUnitName(data.unitName || 'Piece');
            setIsFeatured(data.isFeatured || false);
            setIsBestSeller(data.isBestSeller || false);
            setIsNewLaunch(data.isNewLaunch || false);
            setIsSuperSaver(data.isSuperSaver || false);
            setDetailedBenefits(data.detailedBenefits || []);
            setIngredients(data.ingredients ? data.ingredients.join(', ') : '');
            setUsageInstructions(data.usageInstructions || '');
            setPackageSize(data.packageSize || '');
            setVariants(data.variants || []);
            setTargetAudience(data.targetAudience?.map(a => a._id || a) || []);
            setProductForm(data.productForm?.map(f => f._id || f) || []);
        } catch (error) {
            console.error(error);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const productData = {
            name,
            slug,
            price,
            discountPrice,
            brand,
            description,
            shortDescription,
            unitCount,
            unitName,
            stock: countInStock,
            images: images.length > 0 ? images : [image],
            isFeatured,
            isBestSeller,
            isNewLaunch,
            isSuperSaver,
            detailedBenefits,
            ingredients: ingredients.split(',').map(i => i.trim()).filter(i => i),
            usageInstructions,
            packageSize,
            variants,
            targetAudience,
            productForm
        };

        try {
            if (isEditMode) {
                await axios.put(`http://localhost:5002/api/products/${id}`, productData, config);
            } else {
                await axios.post('http://localhost:5002/api/products', productData, config);
            }
            navigate('/admin/products');
        } catch (error) {
            console.error(error);
            alert(JSON.stringify(error.response?.data) || error.message || 'Error saving product');
        }
    };



    const addVariant = () => {
        setVariants([...variants, { unitCount: 1, unitName: 'Piece' }]);
    };

    const removeVariant = (idx) => {
        setVariants(variants.filter((_, i) => i !== idx));
    };

    const updateVariant = (idx, field, value) => {
        const newVariants = [...variants];
        newVariants[idx][field] = value;
        setVariants(newVariants);
    };

    const uploadFileHandler = async (e) => {
        const files = e.target.files;
        const formData = new FormData();

        if (files.length === 1) {
            formData.append('image', files[0]);
            try {
                const config = {
                    headers: { 'Content-Type': 'multipart/form-data' },
                };
                const { data } = await axios.post('http://localhost:5002/api/upload', formData, config);
                const fullUrl = `http://localhost:5002${data}`;
                setImages([...images, fullUrl]);
            } catch (error) {
                console.error(error);
                alert(error.response?.data?.message || error.message || 'Image upload failed');
            }
        } else if (files.length > 1) {
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }
            try {
                const config = {
                    headers: { 'Content-Type': 'multipart/form-data' },
                };
                const { data } = await axios.post('http://localhost:5002/api/upload/multiple', formData, config);
                const fullUrls = data.map(path => `http://localhost:5002${path}`);
                setImages([...images, ...fullUrls]);
            } catch (error) {
                console.error(error);
                alert(error.response?.data?.message || error.message || 'Multiple image upload failed');
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#fafbfc] py-12 px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <button onClick={() => navigate('/admin/products')} className="p-3 bg-white rounded-full shadow-sm border border-orange-100 text-orange-600 hover:text-green-600 hover:border-green-200 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-md border border-orange-100">
                                Management
                            </span>
                        </div>
                        <h1 className="text-3xl font-heading font-black text-purevit-dark leading-none">
                            {isEditMode ? 'Refine Product' : 'Create Product'}
                        </h1>
                    </div>
                </div>

                <div className="relative">
                    {/* Background Glows */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-orange-100/40 blur-[100px] rounded-full -mr-40 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-50/60 blur-[80px] rounded-full -ml-40 -mb-20"></div>

                    <form onSubmit={submitHandler} className="space-y-6 relative z-10">

                        {/* SECTION 1: Basic Information */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-orange-200/30 space-y-8">
                            <label className="text-[10px] font-black uppercase tracking-widest text-orange-600 ml-1 mb-4 block flex items-center gap-2">
                                <div className="w-1 h-3 bg-orange-500 rounded-full"></div>
                                01. Basic Product Details
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Product Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            if (!isEditMode) setSlug(e.target.value.toLowerCase().replace(/ /g, '-'));
                                        }}
                                        className="w-full px-4 py-3 bg-gradient-to-br from-orange-50/50 to-amber-50/40 border border-orange-200/40 rounded-2xl focus:bg-white focus:border-green-500 focus:shadow-lg transition-all outline-none font-medium text-purevit-dark text-sm hover:border-orange-300/50"
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Slug (URL)</label>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="w-full px-4 py-3 bg-gradient-to-br from-orange-50/50 to-amber-50/40 border border-orange-200/40 rounded-2xl focus:bg-white focus:border-green-500 focus:shadow-lg transition-all outline-none font-medium text-purevit-dark text-sm hover:border-orange-300/50"
                                        placeholder="product-slug"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Short Tagline</label>
                                <input
                                    type="text"
                                    value={shortDescription}
                                    onChange={(e) => setShortDescription(e.target.value)}
                                    className="w-full px-4 py-3 bg-gradient-to-br from-orange-50/50 to-amber-50/40 border border-orange-200/40 rounded-2xl focus:bg-white focus:border-green-500 focus:shadow-lg transition-all outline-none font-medium text-purevit-dark text-sm hover:border-orange-300/50"
                                    placeholder="Enter short tagline"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="4"
                                    className="w-full px-4 py-3 bg-gradient-to-br from-orange-50/50 to-amber-50/40 border border-orange-200/40 rounded-2xl focus:bg-white focus:border-green-500 focus:shadow-lg transition-all outline-none font-medium text-purevit-dark text-sm hover:border-orange-300/50 resize-none"
                                    placeholder="Enter product details..."
                                    required
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-orange-100/50">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Brand</label>
                                    <input
                                        type="text"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        className="w-full px-4 py-3 bg-gradient-to-br from-orange-50/50 to-amber-50/40 border border-orange-200/40 rounded-2xl focus:bg-white focus:border-green-500 focus:shadow-lg transition-all outline-none font-medium text-purevit-dark text-sm hover:border-orange-300/50"
                                        placeholder="Enter brand"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                        <div className="w-1 h-3 bg-green-500 rounded-full"></div>
                                        Target Audience
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {categories.filter(c => c.type === 'audience').map(aud => (
                                            <button
                                                key={aud._id}
                                                type="button"
                                                onClick={() => {
                                                    if (targetAudience.includes(aud._id)) setTargetAudience(targetAudience.filter(id => id !== aud._id));
                                                    else setTargetAudience([...targetAudience, aud._id]);
                                                }}
                                                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${targetAudience.includes(aud._id) ? 'bg-white border-green-500 shadow-md text-purevit-dark' : 'bg-white border-orange-100/60 text-gray-500 hover:border-orange-200'}`}
                                            >
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${targetAudience.includes(aud._id) ? 'bg-green-600 border-green-600' : 'border-gray-200'}`}>
                                                    {targetAudience.includes(aud._id) && <Check size={12} className="text-white" />}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{aud.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                        <div className="w-1 h-3 bg-green-500 rounded-full"></div>
                                        Product Type
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {categories.filter(c => c.type === 'form').map(f => (
                                            <button
                                                key={f._id}
                                                type="button"
                                                onClick={() => {
                                                    if (productForm.includes(f._id)) setProductForm(productForm.filter(id => id !== f._id));
                                                    else setProductForm([...productForm, f._id]);
                                                }}
                                                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${productForm.includes(f._id) ? 'bg-white border-green-500 shadow-md text-purevit-dark' : 'bg-white border-orange-100/60 text-gray-500 hover:border-orange-200'}`}
                                            >
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${productForm.includes(f._id) ? 'bg-green-600 border-green-600' : 'border-gray-200'}`}>
                                                    {productForm.includes(f._id) && <Check size={12} className="text-white" />}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{f.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: Inventory & Variants */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-orange-200/30 space-y-8">
                            <label className="text-[10px] font-black uppercase tracking-widest text-orange-600 ml-1 mb-4 block flex items-center gap-2">
                                <div className="w-1 h-3 bg-orange-500 rounded-full"></div>
                                02. Inventory & Custom Variants
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Selling Price (₹)</label>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="w-full px-4 py-3 bg-gradient-to-br from-orange-50/50 to-amber-50/40 border border-orange-200/40 rounded-2xl focus:bg-white focus:border-green-500 focus:shadow-lg transition-all outline-none font-medium text-purevit-dark text-sm hover:border-orange-300/50"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Default MRP (₹)</label>
                                        <input
                                            type="number"
                                            value={discountPrice}
                                            onChange={(e) => setDiscountPrice(e.target.value)}
                                            className="w-full px-4 py-3 bg-gradient-to-br from-orange-50/50 to-amber-50/40 border border-orange-200/40 rounded-2xl focus:bg-white focus:border-green-500 focus:shadow-lg transition-all outline-none font-medium text-purevit-dark text-sm hover:border-orange-300/50"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Stock Count</label>
                                        <input
                                            type="number"
                                            value={countInStock}
                                            onChange={(e) => setCountInStock(e.target.value)}
                                            className="w-full px-4 py-3 bg-gradient-to-br from-orange-50/50 to-amber-50/40 border border-orange-200/40 rounded-2xl focus:bg-white focus:border-green-500 focus:shadow-lg transition-all outline-none font-medium text-purevit-dark text-sm hover:border-orange-300/50"
                                            placeholder="Available stock"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Package Size</label>
                                        <input
                                            type="text"
                                            value={packageSize}
                                            onChange={(e) => setPackageSize(e.target.value)}
                                            className="w-full px-4 py-3 bg-gradient-to-br from-orange-50/50 to-amber-50/40 border border-orange-200/40 rounded-2xl focus:bg-white focus:border-green-500 focus:shadow-lg transition-all outline-none font-medium text-purevit-dark text-sm hover:border-orange-300/50"
                                            placeholder="1 Pack"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Unit Count</label>
                                        <input
                                            type="number"
                                            value={unitCount}
                                            onChange={(e) => setUnitCount(e.target.value)}
                                            className="w-full px-4 py-3 bg-gradient-to-br from-orange-50/50 to-amber-50/40 border border-orange-200/40 rounded-2xl focus:bg-white focus:border-green-500 focus:shadow-lg transition-all outline-none font-medium text-purevit-dark text-sm hover:border-orange-300/50"
                                            placeholder="50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Unit Name</label>
                                        <input
                                            type="text"
                                            value={unitName}
                                            onChange={(e) => setUnitName(e.target.value)}
                                            className="w-full px-4 py-3 bg-gradient-to-br from-orange-50/50 to-amber-50/40 border border-orange-200/40 rounded-2xl focus:bg-white focus:border-green-500 focus:shadow-lg transition-all outline-none font-medium text-purevit-dark text-sm hover:border-orange-300/50"
                                            placeholder="Tabs"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5 pt-6 mt-6 border-t border-orange-100/50">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-purevit-dark ml-1 flex items-center gap-2">
                                        <div className="w-1 h-3 bg-green-500 rounded-full"></div>
                                        Pack Size Variants
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addVariant}
                                        className="px-4 py-2 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/40 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-md transition-all flex items-center gap-2"
                                    >
                                        <Plus size={14} /> Add Variant
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {variants.map((v, idx) => (
                                        <div key={idx} className="bg-gradient-to-br from-orange-50/30 to-amber-50/30 p-5 rounded-2xl border border-orange-200/30 flex items-end gap-3 group relative">
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(idx)}
                                                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-xl text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                            >
                                                <X size={14} />
                                            </button>
                                            <div className="flex-1 space-y-1">
                                                <label className="text-[9px] uppercase font-black text-gray-400">Count</label>
                                                <input
                                                    type="number"
                                                    value={v.unitCount}
                                                    onChange={(e) => updateVariant(idx, 'unitCount', e.target.value)}
                                                    className="w-full bg-white border border-orange-200/40 rounded-xl px-3 py-2 text-purevit-dark font-bold text-xs focus:border-green-500 outline-none"
                                                />
                                            </div>
                                            <div className="flex-[2] space-y-1">
                                                <label className="text-[9px] uppercase font-black text-gray-400">Name</label>
                                                <input
                                                    type="text"
                                                    value={v.unitName}
                                                    onChange={(e) => updateVariant(idx, 'unitName', e.target.value)}
                                                    className="w-full bg-white border border-orange-200/40 rounded-xl px-3 py-2 text-purevit-dark text-xs focus:border-green-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: Scientific Metadata */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-orange-200/30 space-y-8">
                            <label className="text-[10px] font-black uppercase tracking-widest text-orange-600 ml-1 mb-4 block flex items-center gap-2">
                                <div className="w-1 h-3 bg-orange-500 rounded-full"></div>
                                03. Scientific Metadata
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-2xl border border-green-200/30 space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-green-700 ml-1 flex items-center gap-2">
                                        <Check size={14} className="font-bold" />
                                        Usage Instructions
                                    </label>
                                    <textarea
                                        value={usageInstructions}
                                        onChange={(e) => setUsageInstructions(e.target.value)}
                                        rows="4"
                                        className="w-full bg-white border border-green-200/40 rounded-2xl px-4 py-3 text-purevit-dark focus:outline-none focus:border-green-500 transition-all resize-none placeholder:text-gray-400 text-sm"
                                        placeholder="Explain how to consume (e.g. 1 Tab after breakfast)..."
                                    />
                                </div>

                                <div className="p-6 bg-gradient-to-br from-orange-50/50 to-amber-50/50 rounded-2xl border border-orange-200/30 space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-orange-700 ml-1 flex items-center gap-2">
                                        <Plus size={14} className="font-bold" />
                                        Ingredients List
                                    </label>
                                    <textarea
                                        value={ingredients}
                                        onChange={(e) => setIngredients(e.target.value)}
                                        rows="4"
                                        className="w-full bg-white border border-orange-200/40 rounded-2xl px-4 py-3 text-purevit-dark focus:outline-none focus:border-orange-500 transition-all resize-none placeholder:text-gray-400 text-sm"
                                        placeholder="Vit C, Zinc, Biotin (comma separated)..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-purevit-dark ml-1 flex items-center gap-2">
                                        <div className="w-1 h-3 bg-green-500 rounded-full"></div>
                                        Detailed Benefit Cards
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setDetailedBenefits([...detailedBenefits, { title: '', description: '', iconType: 'emerald' }])}
                                        className="px-4 py-2 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/40 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-md transition-all flex items-center gap-2"
                                    >
                                        <Plus size={14} /> Add Card
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {detailedBenefits.map((benefit, idx) => (
                                        <div key={idx} className="bg-gradient-to-br from-orange-50/30 to-amber-50/30 p-5 rounded-2xl border border-orange-200/30 relative space-y-4">
                                            <button
                                                type="button"
                                                onClick={() => setDetailedBenefits(detailedBenefits.filter((_, i) => i !== idx))}
                                                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-xl text-white flex items-center justify-center shadow-lg"
                                            >
                                                <X size={14} />
                                            </button>
                                            <input
                                                type="text"
                                                value={benefit.title}
                                                onChange={(e) => {
                                                    const newBenefits = [...detailedBenefits];
                                                    newBenefits[idx].title = e.target.value;
                                                    setDetailedBenefits(newBenefits);
                                                }}
                                                placeholder="Title (e.g. Immunity)"
                                                className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-purevit-dark font-bold text-xs focus:border-green-500 outline-none"
                                            />
                                            <textarea
                                                value={benefit.description}
                                                onChange={(e) => {
                                                    const newBenefits = [...detailedBenefits];
                                                    newBenefits[idx].description = e.target.value;
                                                    setDetailedBenefits(newBenefits);
                                                }}
                                                rows="2"
                                                placeholder="Description..."
                                                className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-purevit-dark text-xs focus:border-green-500 outline-none resize-none"
                                            />
                                            <select
                                                value={benefit.iconType}
                                                onChange={(e) => {
                                                    const newBenefits = [...detailedBenefits];
                                                    newBenefits[idx].iconType = e.target.value;
                                                    setDetailedBenefits(newBenefits);
                                                }}
                                                className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-purevit-dark text-[10px] font-black uppercase tracking-widest focus:border-green-500 outline-none"
                                            >
                                                <option value="emerald">Emerald Icon</option>
                                                <option value="blue">Blue Icon</option>
                                                <option value="rose">Rose Icon</option>
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* SECTION 4: Media & Visibility */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-orange-200/30 space-y-8">
                            <label className="text-[10px] font-black uppercase tracking-widest text-orange-600 ml-1 mb-4 block flex items-center gap-2">
                                <div className="w-1 h-3 bg-orange-500 rounded-full"></div>
                                04. Media & Display Flags
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Composition Gallery</label>
                                    <div className="flex flex-wrap gap-4">
                                        {images.map((img, index) => (
                                            <div key={index} className="relative w-24 h-24 bg-gradient-to-br from-orange-50/50 to-amber-50/40 rounded-2xl overflow-hidden border border-orange-200/40 group p-2">
                                                <img src={img} alt="Product" className="w-full h-full object-contain mix-blend-multiply" />
                                                <button
                                                    type="button"
                                                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        ))}
                                        <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-orange-200 rounded-2xl hover:border-green-500 cursor-pointer transition-all text-gray-400 hover:text-green-600 bg-orange-50/20 hover:bg-green-50/30">
                                            <Upload size={24} />
                                            <span className="text-[8px] mt-1 font-black uppercase tracking-widest">Upload</span>
                                            <input type="file" className="hidden" onChange={uploadFileHandler} multiple />
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Discovery Flags</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { id: 'isFeatured', label: 'Featured', state: isFeatured, setter: setIsFeatured },
                                            { id: 'isBestSeller', label: 'Best Seller', state: isBestSeller, setter: setIsBestSeller },
                                            { id: 'isNewLaunch', label: 'New Launch', state: isNewLaunch, setter: setIsNewLaunch },
                                            { id: 'isSuperSaver', label: 'Super Saver', state: isSuperSaver, setter: setIsSuperSaver }
                                        ].map((flag) => (
                                            <button
                                                key={flag.id}
                                                type="button"
                                                onClick={() => flag.setter(!flag.state)}
                                                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${flag.state ? 'bg-white border-green-500 shadow-md text-purevit-dark' : 'bg-white border-orange-100/60 text-gray-500 hover:border-orange-200'}`}
                                            >
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${flag.state ? 'bg-green-600 border-green-600' : 'border-gray-200'}`}>
                                                    {flag.state && <Check size={12} className="text-white" />}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{flag.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Final Action */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full group relative py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] overflow-hidden transition-all duration-300 shadow-xl shadow-green-500/20 hover:shadow-2xl hover:shadow-green-600/30 hover:scale-[1.01] active:scale-[0.99]"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2 text-base">
                                    <Save size={20} />
                                    {isEditMode ? 'Save Changes' : 'Create Product'}
                                </span>
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

};

export default AdminProductEdit;
