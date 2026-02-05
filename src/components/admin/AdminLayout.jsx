import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Users, Star, Film, FolderTree, BarChart3, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || userInfo.role !== 'admin') {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        setIsSidebarOpen(false);
        navigate('/admin/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Featured', path: '/admin/products/featured', icon: Star },
        { name: 'Reels', path: '/admin/reels', icon: Film },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
        { name: 'Categories', path: '/admin/categories', icon: FolderTree },
        { name: 'Users', path: '/admin/users', icon: Users },
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-purevit-secondary">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-purevit-primary/10 sticky top-0 z-50">
                <h1 className="text-xl font-serif font-bold text-purevit-dark">Purevit <span className="text-purevit-primary">Admin</span></h1>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className={`p-2 text-purevit-dark bg-purevit-secondary rounded-xl transition-all active:scale-95 ${isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Overlay for mobile */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <div className={`
                fixed md:relative inset-y-0 left-0 w-64 bg-white border-r border-purevit-primary/10 flex flex-col shadow-sm z-50 
                transition-transform duration-300 ease-in-out md:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-4 md:p-6 border-b border-purevit-primary/10 hidden md:block">
                    <h1 className="text-2xl font-serif font-bold text-purevit-dark">Purevit <span className="text-purevit-primary">Admin</span></h1>
                </div>
                <div className="md:hidden p-4 border-b border-purevit-primary/10 flex justify-between items-center bg-purevit-cream/20">
                    <h1 className="text-lg font-serif font-bold text-purevit-dark">Purevit <span className="text-purevit-primary">Menu</span></h1>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-2 bg-white text-purevit-primary rounded-xl shadow-sm border border-purevit-primary/10 transition-all active:scale-90"
                    >
                        <X size={18} />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center space-x-2.5 md:space-x-3 px-3 py-2.5 md:px-4 md:py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-purevit-primary text-white shadow-lg shadow-purevit-primary/20'
                                    : 'text-purevit-dark hover:bg-purevit-cream hover:translate-x-1'
                                    }`}
                            >
                                <Icon className={`${isActive ? 'scale-110' : ''} w-4.5 h-4.5 md:w-5 md:h-5 transition-transform`} />
                                <span className={`font-bold md:font-medium text-sm md:text-base ${isActive ? 'tracking-wide' : ''}`}>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-3 md:p-4 border-t border-purevit-primary/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 text-red-500 hover:bg-red-50 w-full px-3 py-2.5 md:px-4 md:py-3 rounded-xl transition-all font-bold md:font-medium text-sm md:text-base"
                    >
                        <LogOut className="w-4.5 h-4.5 md:w-5 md:h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-purevit-secondary">
                <div className="p-4 md:p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
