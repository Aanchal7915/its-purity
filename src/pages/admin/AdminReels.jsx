import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Film, ExternalLink, Edit2, X } from 'lucide-react';

const AdminReels = () => {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        videoUrl: '',
        productId: ''
    });
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchReels();
        fetchProducts();
    }, []);

    const fetchReels = async () => {
        try {
            const { data } = await axios.get('http://localhost:5002/api/reels');
            setReels(data);
        } catch (error) {
            console.error('Error fetching reels:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('http://localhost:5002/api/products');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                }
            };

            if (editingId) {
                await axios.put(`http://localhost:5002/api/reels/${editingId}`, formData, config);
                alert('Reel updated successfully!');
            } else {
                await axios.post('http://localhost:5002/api/reels', formData, config);
                alert('Reel created successfully!');
            }

            setFormData({ title: '', videoUrl: '', productId: '' });
            setEditingId(null);
            fetchReels();
        } catch (error) {
            console.error('Error saving reel:', error);
            alert(error.response?.data?.message || 'Error saving reel');
        }
    };

    const handleEdit = (reel) => {
        setEditingId(reel._id);
        setFormData({
            title: reel.title,
            videoUrl: reel.videoUrl,
            productId: reel.product?._id || reel.product || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ title: '', videoUrl: '', productId: '' });
    };

    const deleteReel = async (id) => {
        if (!window.confirm('Are you sure you want to delete this reel?')) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            };
            await axios.delete(`http://localhost:5002/api/reels/${id}`, config);
            alert('Reel deleted successfully!');
            fetchReels();
        } catch (error) {
            console.error('Error deleting reel:', error);
            alert(error.response?.data?.message || 'Error deleting reel');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-serif font-bold text-purevit-dark">Reels Management</h2>
            </div>

            {/* Create/Edit Reel Form */}
            <div className="bg-white rounded-2xl border border-purevit-primary/10 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-purevit-primary/10 text-purevit-primary flex items-center justify-center">
                            <Film size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-purevit-dark">
                                {editingId ? 'Edit Reel' : 'Create New Reel'}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {editingId ? 'Modify existing reel details' : 'Add a new video reel with product link'}
                            </p>
                        </div>
                    </div>
                    {editingId && (
                        <button
                            onClick={cancelEdit}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <X size={16} /> Cancel Edit
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Reel title..."
                                className="w-full bg-purevit-secondary border border-purevit-primary/20 rounded-xl px-4 py-3 text-sm text-purevit-dark focus:border-purevit-primary outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Video URL</label>
                            <input
                                type="url"
                                value={formData.videoUrl}
                                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                placeholder="https://..."
                                className="w-full bg-purevit-secondary border border-purevit-primary/20 rounded-xl px-4 py-3 text-sm text-purevit-dark focus:border-purevit-primary outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Linked Product</label>
                            <select
                                value={formData.productId}
                                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                className="w-full bg-purevit-secondary border border-purevit-primary/20 rounded-xl px-4 py-3 text-sm text-purevit-dark focus:border-purevit-primary outline-none transition-all"
                                required
                            >
                                <option value="">Select a product...</option>
                                {products.map(product => (
                                    <option key={product._id} value={product._id}>{product.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-md flex items-center justify-center gap-2 ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-purevit-primary hover:bg-purevit-dark'} text-white`}
                    >
                        {editingId ? <Edit2 size={16} /> : <Plus size={16} />}
                        {editingId ? 'Update Reel' : 'Create Reel'}
                    </button>
                </form>
            </div>

            {/* Reels List */}
            <div className="bg-white rounded-2xl border border-purevit-primary/10 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-purevit-primary/10">
                    <h3 className="text-xl font-bold text-purevit-dark">All Reels ({reels.length})</h3>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading reels...</div>
                ) : reels.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No reels found. Create your first reel above.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-purevit-cream uppercase text-sm text-purevit-dark font-medium">
                                <tr>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Video URL</th>
                                    <th className="p-4">Linked Product</th>
                                    <th className="p-4">Created At</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-purevit-primary/10">
                                {reels.map((reel) => (
                                    <tr key={reel._id} className="hover:bg-purevit-cream/50 transition-colors">
                                        <td className="p-4 font-medium text-purevit-dark">{reel.title}</td>
                                        <td className="p-4">
                                            <a
                                                href={reel.videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-700 flex items-center gap-2 text-sm"
                                            >
                                                <ExternalLink size={14} />
                                                View Video
                                            </a>
                                        </td>
                                        <td className="p-4 text-gray-600">{reel.product?.name || 'N/A'}</td>
                                        <td className="p-4 text-gray-600 text-sm">
                                            {new Date(reel.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleEdit(reel)}
                                                    className="text-amber-500 hover:text-amber-700 transition-colors"
                                                    title="Edit Reel"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteReel(reel._id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                    title="Delete Reel"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReels;
