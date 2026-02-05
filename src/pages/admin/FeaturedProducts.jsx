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
            const { data } = await axios.get('http://localhost:5002/api/products?isFeatured=true');
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
                await axios.put(`http://localhost:5002/api/products/${id}`, { ...product, isFeatured: false }, config);
                fetchFeaturedProducts();
            } catch (error) {
                console.error(error);
                alert('Error removing product');
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/products')} className="text-gray-500 hover:text-purevit-dark flex items-center gap-2 transition-colors">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <h2 className="text-3xl font-serif font-bold text-purevit-dark flex items-center gap-2">
                        <Star className="text-yellow-500 fill-yellow-500" /> Featured Products
                    </h2>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center mt-20">
                    <Loader className="animate-spin text-purevit-primary" size={40} />
                </div>
            ) : products.length === 0 ? (
                <div className="bg-white rounded-2xl border border-purevit-primary/10 p-12 text-center shadow-sm">
                    <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No featured products found. Edit a product and check "Featured Product" to add it here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white rounded-2xl border border-purevit-primary/10 overflow-hidden shadow-sm group hover:border-yellow-400 transition-all">
                            <div className="relative aspect-video">
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md">FEATURED</div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-bold mb-1 truncate text-purevit-dark">{product.name}</h3>
                                <p className="text-gray-500 text-sm mb-4">{product.brand}</p>

                                <div className="flex items-center justify-between">
                                    <div className="font-bold text-purevit-primary text-lg">
                                        ₹{product.price}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                                            className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => removeFromFeatured(product._id)}
                                            className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors border border-red-200"
                                            title="Remove from Featured"
                                        >
                                            <X size={16} />
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
