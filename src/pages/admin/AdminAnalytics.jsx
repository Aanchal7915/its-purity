import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Legend, PieChart, Pie, Cell
} from 'recharts';
import {
    TrendingUp, Users, ShoppingCart, Eye, MousePointer2,
    ArrowUpRight, ArrowDownRight, Filter, Download,
    DollarSign, Box
} from 'lucide-react';

const AdminAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('year'); // Default to this year
    const [customRange, setCustomRange] = useState({ start: '', end: '' });

    const getDateRange = (type) => {
        const now = new Date();
        let start = new Date();
        let end = new Date();

        switch (type) {
            case 'day':
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;
            case 'week':
                const diff = now.getDate() - now.getDay();
                start = new Date(now.setDate(diff));
                start.setHours(0, 0, 0, 0);
                break;
            case 'month':
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
                start = new Date(now.getFullYear(), 0, 1);
                break;
            case 'custom':
                if (customRange.start && customRange.end) {
                    return { start: customRange.start, end: customRange.end };
                }
                return null;
            default:
                return null;
        }

        return {
            start: start.toISOString(),
            end: end.toISOString()
        };
    };

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const range = getDateRange(filterType);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
                params: range ? { startDate: range.start, endDate: range.end } : {}
            };
            const { data } = await axios.get('http://localhost:5002/api/analytics', config);
            setData(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (filterType !== 'custom' || (customRange.start && customRange.end)) {
            fetchAnalytics();
        }
    }, [filterType, customRange]);

    const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#6366F1'];

    if (loading && !data) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purevit-primary"></div>
        </div>
    );

    if (!data) return <div className="p-8 text-center">Error loading analytics data.</div>;

    const { stats, salesData, statusBreakdown, bestSellers, orders } = data;

    // Mocking some advanced analytics data since backend only provides basic for now
    const trafficData = [
        { name: 'Mon', views: 400, visitors: 240 },
        { name: 'Tue', views: 300, visitors: 139 },
        { name: 'Wed', views: 200, visitors: 980 },
        { name: 'Thu', views: 278, visitors: 390 },
        { name: 'Fri', views: 189, visitors: 480 },
        { name: 'Sat', views: 239, visitors: 380 },
        { name: 'Sun', views: 349, visitors: 430 },
    ];

    const conversionData = [
        { name: 'Store Visit', value: 100 },
        { name: 'Product View', value: 65 },
        { name: 'Add to Cart', value: 25 },
        { name: 'Checkout', value: 15 },
        { name: 'Purchase', value: 8 },
    ];

    return (
        <div className="p-4 md:p-8 space-y-8 bg-[#FAF9F6] min-h-screen pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-purevit-primary/10 shadow-sm">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-purevit-dark flex items-center gap-3">
                        <TrendingUp className="text-purevit-primary" /> Advanced Insights
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Real-time performance metrics tracking.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Standard Filters */}
                    <div className="flex bg-purevit-secondary/50 p-1 rounded-2xl border border-purevit-primary/5">
                        {['day', 'week', 'month', 'year', 'custom'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilterType(t)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${filterType === t
                                    ? 'bg-white text-purevit-primary shadow-sm'
                                    : 'text-gray-400 hover:text-purevit-dark'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Custom Date Inputs */}
                    {filterType === 'custom' && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                            <input
                                type="date"
                                className="bg-white border border-purevit-primary/10 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-purevit-primary"
                                value={customRange.start}
                                onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                            />
                            <span className="text-gray-400 font-bold">to</span>
                            <input
                                type="date"
                                className="bg-white border border-purevit-primary/10 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-purevit-primary"
                                value={customRange.end}
                                onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                            />
                        </div>
                    )}

                    <button className="flex items-center gap-2 px-4 py-2 bg-purevit-dark text-white rounded-xl text-xs font-bold shadow-lg hover:opacity-90 transition-all ml-auto">
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Performance Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    label="Total Revenue"
                    value={`₹${stats.totalRevenue?.toLocaleString()}`}
                    change="+12%"
                    isUp={true}
                    icon={<DollarSign size={20} />}
                />
                <MetricCard
                    label="Active Orders"
                    value={orders.pending + orders.shipped}
                    change="+5%"
                    isUp={true}
                    icon={<ShoppingCart size={20} />}
                />
                <MetricCard
                    label="Total Customers"
                    value={stats.totalCustomers}
                    change={`+${stats.newCustomers} new`}
                    isUp={true}
                    icon={<Users size={20} />}
                />
                <MetricCard
                    label="Total Products"
                    value={stats.totalProducts}
                    change="live"
                    isUp={true}
                    icon={<Box size={20} />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Traffic & Views Chart */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-purevit-primary/10 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-purevit-dark">Traffic & Engagement</h3>
                            <p className="text-sm text-gray-500">Correlation between unique visitors and page views</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesData.length > 0 ? salesData : trafficData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Legend verticalAlign="top" height={36} />
                                <Line type="monotone" dataKey="sales" stroke="#16A34A" strokeWidth={3} dot={{ r: 4, fill: '#16A34A' }} name="Daily Revenue" />
                                <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6' }} name="Total Orders" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Conversion Funnel */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-purevit-primary/10 shadow-sm">
                    <h3 className="text-xl font-bold text-purevit-dark mb-8">Customer Journey Funnel</h3>
                    <div className="space-y-6">
                        {conversionData.map((step, idx) => (
                            <div key={idx} className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">{step.name}</span>
                                    <span className="text-sm font-bold text-purevit-dark">{step.value}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-purevit-secondary/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purevit-primary rounded-full transition-all duration-1000"
                                        style={{ width: `${step.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-4 bg-purevit-cream/50 rounded-2xl border border-purevit-primary/5">
                        <p className="text-xs text-center text-gray-500 leading-relaxed font-bold">
                            <span className="text-purevit-primary">Tip:</span> Your Add to Cart rate is higher than average. Focus on reducing Checkout drop-offs to boost conversion.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product Performance Table */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-purevit-primary/10 shadow-sm">
                    <h3 className="text-xl font-bold text-purevit-dark mb-6">Product Performance Analysis</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-purevit-primary/10">
                                    <th className="pb-4">Product Name</th>
                                    <th className="pb-4">Sold</th>
                                    <th className="pb-4">Revenue</th>
                                    <th className="pb-4">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-purevit-primary/5">
                                {bestSellers.map((item, idx) => (
                                    <tr key={idx} className="group">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-purevit-secondary rounded-xl overflow-hidden p-1">
                                                    <img src={item.productInfo.images?.[0]} alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <span className="text-sm font-bold text-purevit-dark group-hover:text-purevit-primary transition-colors line-clamp-1">{item.productInfo.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm font-bold text-purevit-dark">{item.totalSold}</td>
                                        <td className="py-4 text-sm font-bold text-purevit-dark">₹{item.revenue.toLocaleString()}</td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-1 text-green-500 font-bold text-xs">
                                                <TrendingUp size={14} /> +12%
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Categorical Breakdown */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-purevit-primary/10 shadow-sm flex flex-col items-center">
                    <h3 className="text-xl font-bold text-purevit-dark mb-8 w-full">Sales by Status</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusBreakdown}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={10}
                                    dataKey="count"
                                    nameKey="_id"
                                >
                                    {statusBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-full mt-4 space-y-2">
                        {statusBreakdown.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-xs font-bold">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                    {item._id}
                                </div>
                                <span className="text-purevit-dark">{item.count} Orders</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ label, value, change, isUp, icon }) => (
    <div className="bg-white p-6 rounded-[2.2rem] border border-purevit-primary/10 shadow-sm flex items-center gap-4 hover:shadow-xl transition-all duration-300">
        <div className="w-12 h-12 bg-purevit-secondary rounded-2xl flex items-center justify-center text-purevit-primary flex-shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
            <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-purevit-dark leading-none">{value}</span>
                <span className={`text-[10px] font-black border px-1.5 py-0.5 rounded-lg ${isUp ? 'text-green-500 border-green-100 bg-green-50' : 'text-red-500 border-red-100 bg-red-50'}`}>
                    {change}
                </span>
            </div>
        </div>
    </div>
);

export default AdminAnalytics;
