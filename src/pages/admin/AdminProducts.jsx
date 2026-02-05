import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data } = await axios.get('http://localhost:5002/api/products');
        setProducts(data);
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure?')) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.delete(`http://localhost:5002/api/products/${id}`, config);
            fetchProducts();
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-purevit-dark">Products</h2>
                <Link to="/admin/products/create" className="bg-purevit-primary text-white px-4 py-2.5 md:px-6 md:py-3 rounded-lg md:rounded-xl flex items-center gap-2 hover:bg-purevit-dark transition-all shadow-md font-medium text-xs md:text-base">
                    <Plus className="w-4 h-4 md:w-5 md:h-5" /> Create Product
                </Link>
            </div>

            <div className="bg-white rounded-xl md:rounded-2xl border border-purevit-primary/10 overflow-x-auto no-scrollbar shadow-sm">
                <table className="w-full text-left min-w-[600px] md:min-w-full">
                    <thead className="bg-purevit-cream uppercase text-[10px] md:text-sm text-purevit-dark font-black tracking-widest">
                        <tr>
                            <th className="p-3 md:p-4">Name</th>
                            <th className="p-3 md:p-4">Price</th>
                            <th className="p-3 md:p-4">Audience</th>
                            <th className="p-3 md:p-4">Type</th>
                            <th className="p-3 md:p-4">Stock</th>
                            <th className="p-3 md:p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-purevit-primary/10">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-purevit-cream/50 transition-colors border-b border-purevit-primary/5 last:border-0 text-xs md:text-sm">
                                <td className="p-3 md:p-4 font-bold text-purevit-dark max-w-[150px] truncate">{product.name}</td>
                                <td className="p-3 md:p-4 text-purevit-dark font-medium">₹{product.price}</td>
                                <td className="p-3 md:p-4 text-gray-500 text-[10px] md:text-sm">{product.targetAudience?.map(a => a.name).join(', ') || '—'}</td>
                                <td className="p-3 md:p-4 text-gray-500 text-[10px] md:text-sm">{product.productForm?.map(f => f.name).join(', ') || '—'}</td>
                                <td className="p-3 md:p-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold ${product.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="p-3 md:p-4 flex gap-3">
                                    <Link to={`/admin/products/${product._id}/edit`} className="p-1.5 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => deleteHandler(product._id)}
                                        className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;
