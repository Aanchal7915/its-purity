import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Eye, Check, X, ChevronDown, ChevronUp, Save, MessageSquare, Search, Download, Filter, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [adminNotesInput, setAdminNotesInput] = useState('');
    const [loadingMap, setLoadingMap] = useState({}); // Tracking loading state per order action
    const [searchTerm, setSearchTerm] = useState('');
    const [filterYear, setFilterYear] = useState('All');
    const [filterMonth, setFilterMonth] = useState('All');
    const [filterDate, setFilterDate] = useState('');

    const STATUS_OPTIONS = ['Processing', 'Out for delivery', 'Delivered', 'Cancelled', 'Returned', 'Replaced'];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, config);
        setOrders(data);
    };

    const updateStatus = async (id, status) => {
        if (!window.confirm(`Update status to ${status}?`)) return;

        setLoadingMap(prev => ({ ...prev, [id]: true }));
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${id}/status`, { status }, config);
            fetchOrders();
        } catch (error) {
            console.error(error);
            alert('Error updating status');
        } finally {
            setLoadingMap(prev => ({ ...prev, [id]: false }));
        }
    };

    const saveAdminNotes = async (id) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            // Re-using specific status endpoint or creating a dedicated one?
            // The updateOrderStatus in backend accepts adminNotes!
            // We just need to pass the current status to avoid changing it, or just pass adminNotes if backend allows partial.
            // My backend orderController updateOrderStatus does: order.status = status; ... So I must allow keeping status same.

            const order = orders.find(o => o._id === id);
            if (!order) return;

            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${id}/status`, {
                status: order.status,
                adminNotes: adminNotesInput
            }, config);

            alert('Notes saved');
            fetchOrders();
        } catch (error) {
            console.error(error);
            alert('Failed to save notes');
        }
    };

    const toggleExpand = (order) => {
        if (expandedOrder === order._id) {
            setExpandedOrder(null);
            setAdminNotesInput('');
        } else {
            setExpandedOrder(order._id);
            setAdminNotesInput(order.adminNotes || '');
        }
    };

    const filteredOrders = orders.filter(order => {
        const date = new Date(order.createdAt);
        const matchesSearch =
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesYear = filterYear === 'All' || date.getFullYear().toString() === filterYear;
        const matchesMonth = filterMonth === 'All' || (date.getMonth() + 1).toString() === filterMonth;
        const matchesDate = !filterDate || date.toISOString().split('T')[0] === filterDate;

        return matchesSearch && matchesYear && matchesMonth && matchesDate;
    });

    const handleExport = () => {
        const headers = ["Order ID", "Customer", "Email", "Date", "Total", "Status"];
        const rows = filteredOrders.map(order => [
            `"${order._id}"`,
            `"${order.user?.name || 'Guest'}"`,
            `"${order.user?.email || 'N/A'}"`,
            `"${new Date(order.createdAt).toLocaleDateString()}"`,
            order.totalAmount || order.totalPrice,
            `"${order.status}"`
        ]);

        const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const years = ['All', ...new Set(orders.map(o => new Date(o.createdAt).getFullYear().toString()))].sort().reverse();
    const months = [
        { val: 'All', label: 'All Months' },
        { val: '1', label: 'January' },
        { val: '2', label: 'February' },
        { val: '3', label: 'March' },
        { val: '4', label: 'April' },
        { val: '5', label: 'May' },
        { val: '6', label: 'June' },
        { val: '7', label: 'July' },
        { val: '8', label: 'August' },
        { val: '9', label: 'September' },
        { val: '10', label: 'October' },
        { val: '11', label: 'November' },
        { val: '12', label: 'December' }
    ];

    return (
        <div className="space-y-4 md:space-y-6 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-purevit-dark">Orders Management</h2>
                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-green-600 text-white text-[10px] md:text-xs font-black uppercase tracking-widest rounded-lg md:rounded-xl hover:bg-green-700 transition-all shadow-md group"
                    >
                        <Download size={12} className="group-hover:translate-y-0.5 transition-transform md:w-3.5 md:h-3.5" /> Export
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-2xl md:rounded-[2rem] border border-purevit-primary/10 p-4 md:p-6 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {/* Search Field */}
                    <div className="relative group">
                        <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 ml-1">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purevit-primary transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="ID, Name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 md:py-3 bg-purevit-secondary/50 border border-purevit-primary/10 rounded-xl md:rounded-2xl text-xs md:text-sm outline-none focus:border-purevit-primary transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Year Filter */}
                    <div>
                        <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 ml-1">Year</label>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <select
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 md:py-3 bg-purevit-secondary/50 border border-purevit-primary/10 rounded-xl md:rounded-2xl text-xs md:text-sm outline-none focus:border-purevit-primary appearance-none"
                            >
                                {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Month Filter */}
                    <div>
                        <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 ml-1">Month</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <select
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 md:py-3 bg-purevit-secondary/50 border border-purevit-primary/10 rounded-xl md:rounded-2xl text-xs md:text-sm outline-none focus:border-purevit-primary appearance-none"
                            >
                                {months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Specific Date */}
                    <div>
                        <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 ml-1">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 md:py-3 bg-purevit-secondary/50 border border-purevit-primary/10 rounded-xl md:rounded-2xl text-xs md:text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl md:rounded-2xl border border-purevit-primary/10 overflow-x-auto no-scrollbar shadow-sm">
                <table className="w-full text-left min-w-[700px] md:min-w-full">
                    <thead className="bg-purevit-cream uppercase text-[10px] md:text-sm text-purevit-dark font-black tracking-widest">
                        <tr>
                            <th className="p-3 md:p-4">Order ID</th>
                            <th className="p-3 md:p-4">Customer</th>
                            <th className="p-3 md:p-4">Date</th>
                            <th className="p-3 md:p-4">Total</th>
                            <th className="p-3 md:p-4">Status</th>
                            <th className="p-3 md:p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-purevit-primary/10">

                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-10 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 bg-purevit-cream rounded-full flex items-center justify-center text-gray-300 mb-2">
                                            <Search size={24} />
                                        </div>
                                        <p className="font-medium">No orders found matching your filters.</p>
                                        <button onClick={() => { setSearchTerm(''); setFilterYear('All'); setFilterMonth('All'); setFilterDate(''); }} className="text-purevit-primary text-xs font-bold hover:underline underline-offset-4">Clear All Filters</button>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredOrders.map((order) => (
                            <React.Fragment key={order._id}>
                                <tr className="hover:bg-purevit-cream/50 transition-colors text-xs md:text-sm border-b border-purevit-primary/5 last:border-0">
                                    <td className="p-3 md:p-4 font-mono text-gray-400">#{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                                    <td className="p-3 md:p-4">
                                        <div className="text-purevit-dark font-bold">{order.user?.name || 'Guest'}</div>
                                        <div className="text-[10px] text-gray-400 truncate max-w-[120px]">{order.user?.email}</div>
                                    </td>
                                    <td className="p-3 md:p-4 text-purevit-dark whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3 md:p-4 font-black text-purevit-dark">₹{order.totalAmount || order.totalPrice}</td>
                                    <td className="p-3 md:p-4 min-w-[130px]">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            disabled={loadingMap[order._id]}
                                            className={`w-full bg-white border border-purevit-primary/10 text-[10px] md:text-xs rounded-lg px-2 py-1.5 outline-none focus:border-purevit-primary font-bold transition-all
                                                ${order.status === 'Delivered' ? 'text-green-600 bg-green-50/30' :
                                                    order.status === 'Cancelled' ? 'text-red-600 bg-red-50/30' : 'text-orange-600 bg-orange-50/30'}`}
                                        >
                                            {STATUS_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-3 md:p-4 text-center">
                                        <button
                                            onClick={() => toggleExpand(order)}
                                            className="p-1.5 md:p-2 bg-purevit-cream text-purevit-primary rounded-lg hover:bg-purevit-primary hover:text-white transition-all"
                                        >
                                            {expandedOrder === order._id ? <ChevronUp size={16} /> : <Eye size={16} />}
                                        </button>
                                    </td>
                                </tr>

                                {/* Expanded Row */}
                                <AnimatePresence>
                                    {expandedOrder === order._id && (
                                        <tr>
                                            <td colSpan="6" className="p-0">
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="bg-purevit-cream/30 border-b border-purevit-primary/10 overflow-hidden"
                                                >
                                                    <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                                        <div className="space-y-6">
                                                            <div>
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-purevit-dark mb-3 flex items-center gap-2">
                                                                    <MessageSquare size={14} className="text-purevit-primary" /> User Notes
                                                                </h4>
                                                                <div className="bg-white p-4 rounded-xl border border-purevit-primary/10 text-gray-500 text-xs italic shadow-sm">
                                                                    {order.userNotes || "No notes provided by user."}
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-purevit-dark mb-3">Order Items</h4>
                                                                <div className="bg-white rounded-xl border border-purevit-primary/10 divide-y divide-purevit-primary/5 shadow-sm overflow-hidden text-xs">
                                                                    {order.items.map((item, idx) => (
                                                                        <div key={idx} className="p-3 flex justify-between items-center text-purevit-dark hover:bg-purevit-cream/20 transition-colors">
                                                                            <span className="font-medium">{item.product?.name || item.name || 'Product'} <span className="text-gray-400 ml-1">x{item.quantity}</span></span>
                                                                            <span className="font-bold">₹{item.price * item.quantity}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-6">
                                                            <div>
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-purevit-dark mb-3 flex items-center gap-2">
                                                                    <Save size={14} className="text-purevit-primary" /> Admin Private Notes
                                                                </h4>
                                                                <textarea
                                                                    value={adminNotesInput}
                                                                    onChange={(e) => setAdminNotesInput(e.target.value)}
                                                                    className="w-full bg-white border border-purevit-primary/10 rounded-xl p-3 text-xs focus:border-purevit-primary outline-none min-h-[100px] text-purevit-dark shadow-sm"
                                                                    placeholder="Add private notes here..."
                                                                ></textarea>
                                                                <button
                                                                    onClick={() => saveAdminNotes(order._id)}
                                                                    className="mt-2 w-full md:w-auto bg-purevit-primary text-white font-black uppercase tracking-widest py-2.5 px-6 rounded-lg text-[10px] hover:bg-purevit-dark transition shadow-md flex items-center justify-center gap-2"
                                                                >
                                                                    <Save size={14} /> Save Notes
                                                                </button>
                                                            </div>

                                                            <div className="bg-white p-4 rounded-xl border border-purevit-primary/10 shadow-sm">
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-purevit-dark mb-3">Shipping Address</h4>
                                                                <div className="text-[11px] text-gray-500 leading-relaxed">
                                                                    <p className="font-bold text-purevit-dark">{order.shippingAddress?.street}</p>
                                                                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zip}</p>
                                                                    <p>{order.shippingAddress?.country}</p>
                                                                    <p className="mt-2 flex items-center gap-2">
                                                                        <span className="text-purevit-primary font-black">CALL:</span>
                                                                        <span className="text-purevit-dark font-bold">{order.shippingAddress?.phone}</span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
