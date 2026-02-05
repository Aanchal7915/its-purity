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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-serif font-bold text-purevit-dark">Products</h2>
                <Link to="/admin/products/create" className="bg-purevit-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-purevit-dark transition-all shadow-md font-medium">
                    <Plus className="w-5 h-5" /> Create Product
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-purevit-primary/10 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-purevit-cream uppercase text-sm text-purevit-dark font-medium">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Audience</th>
                            <th className="p-4">Product Type</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-purevit-primary/10">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-purevit-cream/50 transition-colors">
                                <td className="p-4 font-medium text-purevit-dark">{product.name}</td>
                                <td className="p-4 text-purevit-dark">₹{product.price}</td>
                                <td className="p-4 text-gray-600">{product.targetAudience?.map(a => a.name).join(', ') || '—'}</td>
                                <td className="p-4 text-gray-600">{product.productForm?.map(f => f.name).join(', ') || '—'}</td>
                                <td className="p-4 text-purevit-dark">{product.stock}</td>
                                <td className="p-4 flex gap-3">
                                    <Link to={`/admin/products/${product._id}/edit`} className="text-blue-500 hover:text-blue-700 transition-colors">
                                        <Edit className="w-5 h-5" />
                                    </Link>
                                    <button
                                        onClick={() => deleteHandler(product._id)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
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
