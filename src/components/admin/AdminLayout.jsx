import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Users, Star, Film, FolderTree, BarChart3 } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || userInfo.role !== 'admin') {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
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
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-white border-r border-purevit-primary/10 flex flex-col shadow-sm md:min-h-screen">
                <div className="p-6 border-b border-purevit-primary/10">
                    <h1 className="text-2xl font-serif font-bold text-purevit-dark">Purevit <span className="text-purevit-primary">Admin</span></h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-purevit-primary text-white shadow-md'
                                    : 'text-purevit-dark hover:bg-purevit-cream'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-purevit-primary/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 text-red-500 hover:bg-red-50 w-full px-4 py-3 rounded-xl transition-all font-medium"
                    >
                        <LogOut className="w-5 h-5" />
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
