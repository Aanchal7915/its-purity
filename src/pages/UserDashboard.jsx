import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, ShoppingBag, Heart, LogOut, CheckCircle, Truck, Package, XCircle, ChevronRight, Settings, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [user, setUser] = useState({});
    const [wishlist, setWishlist] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                // Fetch Profile (includes wishlist)
                const { data: profileData } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, config);
                setUser(profileData);
                setWishlist(profileData.wishlist || []);

                // Sync localStorage cache
                const ids = (profileData.wishlist || []).filter(p => p !== null).map(p => p._id);
                localStorage.setItem('wishlistIds', JSON.stringify(ids));

                // Fetch Orders
                const { data: ordersData } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders/myorders`, config);
                setOrders(ordersData);

            } catch (error) {
                console.error(error);
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('userInfo');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate, userInfo?.token]);


    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, user, config);
            alert('Profile Updated Successfully');
        } catch (error) {
            console.error(error);
            alert('Error updating profile');
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/users/wishlist/${productId}`, config);
            const updatedWishlist = wishlist.filter(item => item._id !== productId);
            setWishlist(updatedWishlist);

            // Sync localStorage
            const ids = updatedWishlist.map(p => p._id);
            localStorage.setItem('wishlistIds', JSON.stringify(ids));
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-purevit-secondary flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purevit-primary/20 border-t-purevit-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-purevit-secondary py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Sidebar / Navigation */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-purevit-primary/5">
                            <div className="flex flex-col items-center text-center mb-10">
                                <div className="w-24 h-24 rounded-full bg-purevit-cream flex items-center justify-center text-purevit-primary mb-4 border-4 border-purevit-secondary shadow-inner">
                                    <User size={40} />
                                </div>
                                <h2 className="text-xl font-serif font-bold text-purevit-dark">{user.name}</h2>
                                <p className="text-sm text-gray-400 font-medium">{user.email}</p>
                            </div>

                            <nav className="space-y-2">
                                {[
                                    { id: 'profile', label: 'My Profile', icon: <User size={18} /> },
                                    { id: 'orders', label: 'My Orders', icon: <ShoppingBag size={18} /> },
                                    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} /> }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 ${activeTab === tab.id
                                            ? 'bg-purevit-dark text-white shadow-lg translate-x-1'
                                            : 'text-gray-500 hover:bg-purevit-secondary hover:text-purevit-dark'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {tab.icon}
                                            <span className="font-bold text-sm tracking-tight">{tab.label}</span>
                                        </div>
                                        <ChevronRight size={14} className={activeTab === tab.id ? 'opacity-100' : 'opacity-30'} />
                                    </button>
                                ))}

                                <div className="pt-6 mt-6 border-t border-gray-100">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all font-bold text-sm"
                                    >
                                        <LogOut size={18} /> Logout
                                    </button>
                                </div>
                            </nav>
                        </div>

                        {/* Help Desk Card */}
                        <div className="bg-purevit-cream rounded-[2rem] p-8 text-purevit-dark relative overflow-hidden group border border-purevit-primary/10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purevit-primary/5 blur-3xl rounded-full"></div>
                            <h3 className="text-lg font-serif mb-2 relative z-10">Need Help?</h3>
                            <p className="text-xs text-purevit-dark/60 mb-6 leading-relaxed relative z-10">Our wellness experts are here to assist you with your journey.</p>
                            <Link to="/contact" className="text-xs font-black uppercase tracking-widest text-purevit-primary hover:underline relative z-10">Contact Support</Link>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9">

                        {activeTab === 'profile' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-purevit-primary/5">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-12 h-12 rounded-2xl bg-purevit-cream flex items-center justify-center text-purevit-dark">
                                            <Settings size={22} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-serif text-purevit-dark">Profile Settings</h2>
                                            <p className="text-gray-400 text-sm">Manage your account information and preferences</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleUpdateProfile} className="space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-purevit-dark/40 ml-1">Full Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <input
                                                        type="text"
                                                        value={user.name || ''}
                                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-purevit-dark/40 ml-1">Email (Permanent)</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                                    <input
                                                        type="email"
                                                        value={user.email || ''}
                                                        disabled
                                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 cursor-not-allowed font-medium"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-purevit-dark/40 ml-1">Phone Number</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <input
                                                        type="text"
                                                        value={user.phone || ''}
                                                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-10 border-t border-gray-100">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-10 h-10 rounded-xl bg-purevit-cream flex items-center justify-center text-purevit-dark">
                                                    <MapPin size={18} />
                                                </div>
                                                <h3 className="text-xl font-serif text-purevit-dark">Shipping Address</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-purevit-dark/40 ml-1">Street Address</label>
                                                    <input
                                                        type="text"
                                                        value={user.address?.street || ''}
                                                        onChange={(e) => setUser({ ...user, address: { ...user.address, street: e.target.value } })}
                                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-purevit-dark/40 ml-1">City</label>
                                                    <input
                                                        type="text"
                                                        value={user.address?.city || ''}
                                                        onChange={(e) => setUser({ ...user, address: { ...user.address, city: e.target.value } })}
                                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-purevit-dark/40 ml-1">State</label>
                                                    <input
                                                        type="text"
                                                        value={user.address?.state || ''}
                                                        onChange={(e) => setUser({ ...user, address: { ...user.address, state: e.target.value } })}
                                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-2 flex-grow">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-purevit-dark/40 ml-1">ZIP / Postal</label>
                                                    <input
                                                        type="text"
                                                        value={user.address?.zip || ''}
                                                        onChange={(e) => setUser({ ...user, address: { ...user.address, zip: e.target.value } })}
                                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                type="submit"
                                                className="group relative px-12 py-4 bg-purevit-dark hover:bg-black text-white rounded-2xl font-bold overflow-hidden transition-all duration-300 shadow-xl"
                                            >
                                                <span className="relative z-10">Update Profile</span>
                                                <div className="absolute inset-0 bg-purevit-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between mb-2 px-4">
                                    <h2 className="text-3xl font-serif text-purevit-dark">Order History</h2>
                                    <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                                        Total Orders: {orders.length}
                                    </div>
                                </div>

                                {orders.length === 0 ? (
                                    <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-lg border border-purevit-primary/5">
                                        <div className="w-20 h-20 bg-purevit-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                                            <ShoppingBag size={32} />
                                        </div>
                                        <h3 className="text-2xl font-serif text-purevit-dark mb-2">No orders yet</h3>
                                        <p className="text-gray-400 mb-8 max-w-xs mx-auto">Start your health journey by exploring our pure collections.</p>
                                        <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-purevit-primary text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-purevit-dark hover:text-white transition-all shadow-lg">
                                            Shop Now <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {orders.map((order) => (
                                            <div key={order._id} className="bg-white rounded-[2.5rem] shadow-xl border border-purevit-primary/5 overflow-hidden transition-all duration-500 hover:shadow-2xl">
                                                <div className="p-8 border-b border-gray-50 bg-purevit-cream/20 flex flex-col md:flex-row justify-between md:items-center gap-6">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order ID:</span>
                                                            <span className="text-xs font-mono font-bold text-purevit-dark">#{order._id.slice(-8).toUpperCase()}</span>
                                                        </div>
                                                        <div className="text-sm font-bold text-purevit-dark">Planted on {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-right">
                                                            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Total</span>
                                                            <span className="text-2xl font-bold text-purevit-dark">₹{order.totalAmount}</span>
                                                        </div>
                                                        <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border
                                                        ${order.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-100' :
                                                                order.status === 'Processing' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                                    'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                            {order.status}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-8 pb-4">
                                                    <div className="flex flex-wrap gap-4">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="flex-1 min-w-[200px] p-4 rounded-2xl bg-purevit-secondary/30 flex items-center gap-4 group transition-colors hover:bg-purevit-secondary/50">
                                                                <div className="w-16 h-16 rounded-xl bg-white overflow-hidden shadow-sm shrink-0">
                                                                    <img src={item.product?.image || item.image || "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80"} alt="" className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <h4 className="text-sm font-bold text-purevit-dark truncate">{item.product?.name || item.name}</h4>
                                                                    <p className="text-xs text-gray-400 font-medium">Qty: {item.quantity} · ₹{item.price}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="p-8 pt-4 flex justify-between items-center bg-gray-50/30">
                                                    <div className="flex -space-x-2">
                                                        <div className="w-8 h-8 rounded-full bg-purevit-primary flex items-center justify-center text-black border-2 border-white shadow-sm ring-1 ring-purevit-primary/20">
                                                            <Truck size={14} />
                                                        </div>
                                                        <span className="pl-4 text-[10px] font-black uppercase tracking-widest text-gray-400 self-center">Standard Logistics</span>
                                                    </div>
                                                    <button className="text-xs font-black uppercase tracking-widest text-purevit-primary hover:text-purevit-dark transition-colors">Track Order Details</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between px-4">
                                    <h2 className="text-3xl font-serif text-purevit-dark">Your Wishlist</h2>
                                    <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                                        {wishlist.length} Items Saved
                                    </div>
                                </div>

                                {wishlist.length === 0 ? (
                                    <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-lg border border-purevit-primary/5">
                                        <div className="w-20 h-20 bg-purevit-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                                            <Heart size={32} />
                                        </div>
                                        <h3 className="text-2xl font-serif text-purevit-dark mb-2">No favorites yet</h3>
                                        <p className="text-gray-400 mb-8 max-w-xs mx-auto">Items you like will grow here, ready for your next checkout.</p>
                                        <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-purevit-primary text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-purevit-dark hover:text-white transition-all shadow-lg">
                                            Discover Products <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {wishlist.map((item) => (
                                            <div key={item._id} className="group bg-white rounded-[2rem] overflow-hidden shadow-lg border border-purevit-primary/5 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                                                <div className="aspect-[4/5] bg-purevit-secondary relative overflow-hidden">
                                                    <img
                                                        src={item.images?.[0] || item.image || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80"}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <button
                                                        onClick={() => removeFromWishlist(item._id)}
                                                        className="absolute top-5 right-5 w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all transform hover:rotate-12"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                                <div className="p-6">
                                                    <h3 className="font-serif text-xl text-purevit-dark mb-1 truncate">{item.name}</h3>
                                                    <p className="text-purevit-primary font-bold mb-4">₹{item.price}</p>
                                                    <Link
                                                        to={`/products/${item._id}`}
                                                        className="w-full py-3 bg-purevit-dark rounded-xl text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-purevit-primary transition-colors"
                                                    >
                                                        View Product
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
