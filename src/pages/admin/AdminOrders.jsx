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
        const { data } = await axios.get('http://localhost:5002/api/orders', config);
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
            await axios.put(`http://localhost:5002/api/orders/${id}/status`, { status }, config);
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

            await axios.put(`http://localhost:5002/api/orders/${id}/status`, {
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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-3xl font-serif font-bold text-purevit-dark">Orders Management</h2>
                <div className="flex items-center gap-3">
                    <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                        {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'} Found
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-green-700 transition-all shadow-md group"
                    >
                        <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-[2rem] border border-purevit-primary/10 p-6 shadow-sm overflow-visible">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search Field */}
                    <div className="relative group">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Search Orders</label>
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purevit-primary transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="ID, Name or Email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-purevit-secondary/50 border border-purevit-primary/10 rounded-2xl text-sm outline-none focus:border-purevit-primary transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Year Filter */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Year</label>
                        <div className="relative">
                            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-purevit-secondary/50 border border-purevit-primary/10 rounded-2xl text-sm outline-none focus:border-purevit-primary transition-all appearance-none"
                            >
                                {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Month Filter */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Month</label>
                        <div className="relative">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-purevit-secondary/50 border border-purevit-primary/10 rounded-2xl text-sm outline-none focus:border-purevit-primary transition-all appearance-none"
                            >
                                {months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Specific Date */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Specific Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-purevit-secondary/50 border border-purevit-primary/10 rounded-2xl text-sm outline-none focus:border-purevit-primary transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-purevit-primary/10 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-purevit-cream uppercase text-sm text-purevit-dark font-medium">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">User</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
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
                                <tr className="hover:bg-purevit-cream/50 transition-colors">
                                    <td className="p-4 font-mono text-sm text-gray-500">{order._id.substring(0, 10)}...</td>
                                    <td className="p-4">
                                        <div className="text-purevit-dark font-medium">{order.user?.name || 'Guest'}</div>
                                        <div className="text-xs text-gray-500">{order.user?.email}</div>
                                    </td>
                                    <td className="p-4 text-purevit-dark">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold text-purevit-dark">₹{order.totalAmount || order.totalPrice}</td>
                                    <td className="p-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            disabled={loadingMap[order._id]}
                                            className={`bg-white border border-purevit-primary/20 text-xs rounded-lg px-3 py-2 outline-none focus:border-purevit-primary font-medium
                                                ${order.status === 'Delivered' ? 'text-green-600' :
                                                    order.status === 'Cancelled' ? 'text-red-600' : 'text-orange-600'}`}
                                        >
                                            {STATUS_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => toggleExpand(order)}
                                            className="p-2 hover:bg-purevit-cream rounded-full transition text-purevit-primary"
                                        >
                                            {expandedOrder === order._id ? <ChevronUp size={20} /> : <Eye size={20} />}
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
                                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div>
                                                            <h4 className="font-bold text-purevit-dark mb-4 flex items-center gap-2">
                                                                <MessageSquare size={16} /> User Notes
                                                            </h4>
                                                            <div className="bg-white p-4 rounded-xl border border-purevit-primary/10 text-gray-600 min-h-[100px] text-sm italic">
                                                                {order.userNotes || "No notes provided by user."}
                                                            </div>

                                                            <h4 className="font-bold text-purevit-dark mt-6 mb-4">Items</h4>
                                                            <div className="space-y-2">
                                                                {order.items.map((item, idx) => (
                                                                    <div key={idx} className="flex justify-between text-sm border-b border-purevit-primary/10 pb-2 text-purevit-dark">
                                                                        <span>{item.product?.name || 'Product'} (x{item.quantity})</span>
                                                                        <span className="font-medium">₹{item.price * item.quantity}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h4 className="font-bold text-purevit-dark mb-4">Admin Private Notes</h4>
                                                            <textarea
                                                                value={adminNotesInput}
                                                                onChange={(e) => setAdminNotesInput(e.target.value)}
                                                                className="w-full bg-white border border-purevit-primary/20 rounded-xl p-3 text-sm focus:border-purevit-primary outline-none min-h-[100px] text-purevit-dark"
                                                                placeholder="Add private notes here..."
                                                            ></textarea>
                                                            <button
                                                                onClick={() => saveAdminNotes(order._id)}
                                                                className="mt-3 bg-purevit-primary text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-purevit-dark transition flex items-center gap-2"
                                                            >
                                                                <Save size={16} /> Save Notes
                                                            </button>

                                                            <div className="mt-6 text-sm text-gray-600 bg-white p-4 rounded-xl border border-purevit-primary/10">
                                                                <p className="font-bold text-purevit-dark mb-2">Shipping Address:</p>
                                                                <p>{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
                                                                <p>{order.shippingAddress?.state} - {order.shippingAddress?.zip}</p>
                                                                <p>{order.shippingAddress?.country}</p>
                                                                <p className="mt-1">Phone: {order.shippingAddress?.phone}</p>
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
