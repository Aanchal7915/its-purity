import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Star, Trash, Edit, ArrowLeft, Loader, X } from 'lucide-react';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products?isFeatured=true`);
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const removeFromFeatured = async (id) => {
        if (window.confirm('Remove from Featured?')) {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const product = products.find(p => p._id === id);
                await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`, { ...product, isFeatured: false }, config);
                fetchFeaturedProducts();
            } catch (error) {
                console.error(error);
                alert(`Error removing product`);
            }
        }
    };

    return (
        <div className="space-y-4 md:space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                    <button onClick={() => navigate('/admin/products')} className="text-gray-500 hover:text-purevit-dark flex items-center gap-1 md:gap-2 transition-colors text-xs md:text-base">
                        <ArrowLeft size={16} className="md:w-5 md:h-5" /> <span className="hidden xs:inline">Back</span>
                    </button>
                    <h2 className="text-xl md:text-3xl font-serif font-bold text-purevit-dark flex items-center gap-2">
                        <Star className="text-yellow-500 fill-yellow-500 w-5 h-5 md:w-8 md:h-8" /> Featured
                    </h2>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center mt-20">
                    <Loader className="animate-spin text-purevit-primary" size={40} />
                </div>
            ) : products.length === 0 ? (
                <div className="bg-white rounded-xl md:rounded-2xl border border-purevit-primary/10 p-8 md:p-12 text-center shadow-sm">
                    <Star className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm md:text-base">No featured products found. Edit a product and check "Featured Product" to add it here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white rounded-xl md:rounded-2xl border border-purevit-primary/10 overflow-hidden shadow-sm group hover:border-yellow-400 transition-all">
                            <div className="relative aspect-[16/10]">
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-yellow-500 text-white text-[8px] md:text-xs font-black px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg shadow-md tracking-tighter md:tracking-normal">FEATURED</div>
                            </div>
                            <div className="p-4 md:p-5">
                                <h3 className="text-base md:text-lg font-bold mb-0.5 md:mb-1 truncate text-purevit-dark">{product.name}</h3>
                                <p className="text-gray-500 text-[10px] md:text-sm mb-3 md:mb-4">{product.brand}</p>

                                <div className="flex items-center justify-between">
                                    <div className="font-bold text-purevit-primary text-base md:text-lg">
                                        ₹{product.price}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                                            className="p-1.5 md:p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={14} className="md:w-4 md:h-4" />
                                        </button>
                                        <button
                                            onClick={() => removeFromFeatured(product._id)}
                                            className="p-1.5 md:p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors border border-red-200"
                                            title="Remove"
                                        >
                                            <X size={14} className="md:w-4 md:h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FeaturedProducts;
