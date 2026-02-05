import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    DollarSign, ShoppingBag, Box, Users, Activity, TrendingUp,
    AlertTriangle, CheckCircle, Clock, Truck, Package,
    ArrowUpRight, ArrowDownRight, Bell, Star, ShoppingCart
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, AreaChart, Area,
    PieChart, Pie, Cell
} from 'recharts';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                const { data: analyticsData } = await axios.get('http://localhost:5002/api/analytics', config);
                setData(analyticsData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#6366F1'];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purevit-primary"></div>
        </div>
    );

    if (!data) return <div className="p-8 text-center">Error loading dashboard data.</div>;

    const { stats, orders, lowStock, bestSellers, statusBreakdown, salesData, recentOrders } = data;

    return (
        <div className="p-3 md:p-8 bg-[#FAF9F6] min-h-screen space-y-4 md:space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-serif font-bold text-purevit-dark leading-tight">Business Command Center</h1>
                    <p className="text-xs md:text-gray-500 mt-1">Real-time snapshot of your store's performance.</p>
                </div>
                <div className="flex items-center gap-3">

                    <div className="bg-white border border-purevit-primary/10 rounded-xl md:rounded-2xl px-3 py-1.5 md:px-4 md:py-2 shadow-sm">
                        <span className="text-[8px] md:text-xs font-black uppercase tracking-widest text-gray-400 block leading-none mb-1">Status</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs md:text-sm font-bold text-purevit-dark">Live Updates</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue?.toLocaleString()}`}
                    change="+12.5%"
                    isUp={true}
                    icon={<DollarSign size={24} />}
                    color="green"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    change="+8.2%"
                    isUp={true}
                    icon={<ShoppingBag size={24} />}
                    color="blue"
                />
                <StatCard
                    title="Average Order Value"
                    value={`₹${(stats.totalRevenue / (stats.totalOrders || 1)).toFixed(0)}`}
                    change="-2.4%"
                    isUp={false}
                    icon={<TrendingUp size={24} />}
                    color="amber"
                />
                <StatCard
                    title="Total Customers"
                    value={stats.totalCustomers}
                    change={`+${stats.newCustomers} new`}
                    isUp={true}
                    icon={<Users size={24} />}
                    color="purple"
                />
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Sales Chart - Column Span 2 */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                    <div className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-purevit-primary/10 shadow-sm relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-6 md:mb-8">
                            <div>
                                <h3 className="text-lg md:text-2xl font-serif font-bold text-purevit-dark">Revenue Insights</h3>
                                <p className="text-[10px] md:text-sm text-gray-500 mt-1">Daily sales performance</p>
                            </div>
                            <select className="bg-purevit-secondary/50 border border-purevit-primary/10 rounded-xl px-3 py-2 text-xs font-bold text-purevit-dark outline-none focus:border-purevit-primary">
                                <option>Last 30 Days</option>
                                <option>Last 7 Days</option>
                            </select>
                        </div>
                        <div className="h-[250px] md:h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={salesData}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#16A34A" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="_id"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="sales" stroke="#16A34A" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Order Summary Widgets */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        <StatusWidget label="Pending" count={orders.pending} icon={<Clock className="text-amber-500" />} />
                        <StatusWidget label="Shipped" count={orders.shipped} icon={<Truck className="text-blue-500" />} />
                        <StatusWidget label="Delivered" count={orders.delivered} icon={<CheckCircle className="text-emerald-500" />} />
                    </div>
                </div>

                {/* Sidebar - Column 1 */}
                <div className="space-y-8">
                    {/* Status Breakdown Circle */}
                    <div className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-purevit-primary/10 shadow-sm">
                        <h3 className="text-lg md:text-xl font-bold text-purevit-dark mb-4 md:mb-6">Order Mix</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusBreakdown}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={8}
                                        dataKey="count"
                                        nameKey="_id"
                                    >
                                        {statusBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Inventory Watch */}
                    <div className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-purevit-primary/10 shadow-sm">
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <h3 className="text-lg md:text-xl font-bold text-purevit-dark">Low Stock</h3>
                            <AlertTriangle className="text-red-500" size={18} />
                        </div>
                        <div className="space-y-4">
                            {lowStock.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">All products well stocked.</p>
                            ) : lowStock.map(p => (
                                <div key={p._id} className="flex items-center justify-between p-3 bg-red-50 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex-shrink-0 border border-red-100 p-1">
                                            <img src={p.images?.[0]} alt="" className="w-full h-full object-contain" />
                                        </div>
                                        <p className="text-xs font-bold text-purevit-dark truncate w-24">{p.name}</p>
                                    </div>
                                    <span className="text-xs font-black text-red-600 bg-white px-2 py-1 rounded-lg border border-red-100">{p.stock} Left</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row - Activity & Best Sellers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-purevit-primary/10 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 md:p-8 pb-3 md:pb-4 border-b border-purevit-primary/10 flex items-center justify-between">
                        <h3 className="text-lg md:text-xl font-bold text-purevit-dark">Recent Notifications</h3>
                        <Activity size={20} className="text-purevit-primary" />
                    </div>
                    <div className="flex-1 overflow-auto max-h-[400px]">
                        {recentOrders.map((order, i) => (
                            <div key={order._id} className="p-4 hover:bg-purevit-secondary/30 transition-colors border-b border-purevit-primary/5 last:border-0 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-purevit-secondary flex items-center justify-center text-purevit-primary flex-shrink-0">
                                    <Bell size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-purevit-dark truncate">
                                        New Order from {order.user?.name || 'Guest'}
                                    </p>
                                    <p className="text-xs text-gray-400">Order ID: #{order._id.slice(-6).toUpperCase()} • ₹{order.totalAmount}</p>
                                </div>
                                <span className="text-[10px] font-black uppercase text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Best Sellers */}
                <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-purevit-primary/10 shadow-sm overflow-hidden">
                    <div className="p-4 md:p-8 pb-3 md:pb-4 border-b border-purevit-primary/10 flex items-center justify-between">
                        <h3 className="text-lg md:text-xl font-bold text-purevit-dark">Top Performers</h3>
                        <Star size={20} className="text-amber-500 fill-amber-500" />
                    </div>
                    <div className="p-4 space-y-4">
                        {bestSellers.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-4 h-4 text-[10px] font-black text-gray-300 group-hover:text-purevit-primary transition-colors">{idx + 1}</div>
                                    <div className="w-14 h-14 bg-purevit-secondary rounded-2xl p-2 group-hover:scale-105 transition-transform">
                                        <img src={item.productInfo.images?.[0]} alt="" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-purevit-dark">{item.productInfo.name}</p>
                                        <p className="text-xs text-gray-400">{item.totalSold} Units Sold</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-purevit-primary">₹{item.revenue.toLocaleString()}</p>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-green-500">
                                        <ArrowUpRight size={10} /> 14%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, change, isUp, icon, color }) => {
    const colorClasses = {
        green: 'bg-emerald-500/10 text-emerald-600',
        blue: 'bg-blue-500/10 text-blue-600',
        amber: 'bg-amber-500/10 text-amber-600',
        purple: 'bg-purple-500/10 text-purple-600'
    };
    return (
        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2.2rem] border border-purevit-primary/10 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 md:mb-4 relative z-10">
                <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${colorClasses[color]}`}>
                    {React.cloneElement(icon, { size: 20, className: "md:w-6 md:h-6" })}
                </div>
                <div className={`flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-black ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {isUp ? <ArrowUpRight size={10} className="md:w-3 md:h-3" /> : <ArrowDownRight size={10} className="md:w-3 md:h-3" />}
                    {change}
                </div>
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{title}</p>
                <p className="text-xl md:text-3xl font-sans font-bold text-purevit-dark tracking-tight">{value}</p>
            </div>
            {/* Background Accent */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700 ${colorClasses[color].split(' ')[0]}`}></div>
        </div>
    );
};

const StatusWidget = ({ label, count, icon }) => (
    <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-purevit-primary/10 shadow-sm flex items-center justify-between group hover:border-purevit-primary/30 transition-colors">
        <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-purevit-secondary/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                {React.cloneElement(icon, { className: "w-5 h-5 md:w-6 md:h-6" })}
            </div>
            <div>
                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
                <p className="text-lg md:text-xl font-bold text-purevit-dark">{count}</p>
            </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-purevit-secondary/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight size={14} className="text-gray-400" />
        </div>
    </div>
);

export default AdminDashboard;
