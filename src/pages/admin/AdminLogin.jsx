import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldCheck, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post('http://localhost:5002/api/auth/login', { email, password });

            if (data.role === 'admin') {
                localStorage.setItem('userInfo', JSON.stringify(data));
                navigate('/admin/dashboard');
            } else {
                setError('Not authorized as admin');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-purevit-secondary py-20 px-4">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-purevit-primary/5">
                {/* Left Side: Branding */}
                <div className="hidden lg:flex flex-col justify-center p-16 bg-purevit-cream text-purevit-dark relative overflow-hidden border-r border-purevit-primary/10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purevit-primary/10 blur-[120px] rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purevit-primary/5 blur-[120px] rounded-full -ml-20 -mb-20"></div>

                    <Link to="/" className="mb-12 relative z-10 transition-transform hover:scale-105 inline-block">
                        <span className="text-4xl font-serif font-bold tracking-tight">
                            <span className="text-purevit-dark">Pure</span>
                            <span className="text-purevit-primary">vit</span>
                        </span>
                    </Link>

                    <div className="relative z-10">
                        <h1 className="text-6xl font-serif mb-8 leading-tight">Admin <br /><span className="italic text-purevit-primary underline decoration-purevit-primary/20 underline-offset-8">Portal.</span></h1>
                        <p className="text-gray-500 text-lg mb-12 max-w-md leading-relaxed">Access the management dashboard to oversee products, orders, and wellness analytics.</p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-5 group">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-purevit-primary/10 flex items-center justify-center text-purevit-primary shadow-sm group-hover:bg-purevit-primary group-hover:text-white transition-all duration-500">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <span className="block text-sm font-black uppercase tracking-widest text-purevit-dark/40">Secure Access</span>
                                    <span className="text-sm font-bold text-purevit-dark">Admin Only Entry</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-white">
                    <div className="max-w-md w-full mx-auto">
                        <div className="mb-10">
                            <Link to="/" className="inline-flex items-center gap-2 text-purevit-primary mb-6 text-xs font-black uppercase tracking-widest hover:underline">
                                <ArrowLeft size={14} /> Back to Website
                            </Link>
                            <h2 className="text-4xl font-serif text-purevit-dark mb-2">Admin Sign In</h2>
                            <p className="text-gray-500">Secure authorization required</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-8 flex items-center gap-3 border border-red-100">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-purevit-dark/60 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        placeholder="admin@purevit.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-purevit-secondary/50 border border-purevit-primary/10 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-purevit-dark/60 ml-1">Secure Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-purevit-secondary/50 border border-purevit-primary/10 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group relative py-5 bg-purevit-dark hover:bg-black text-white rounded-[1.25rem] font-bold overflow-hidden transition-all duration-300 shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:scale-100"
                            >
                                <div className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <LogIn size={20} className="text-purevit-primary" />
                                            <span>Authorize Access</span>
                                        </>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-purevit-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>
                        </form>

                        <div className="mt-12 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purevit-secondary rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-purevit-primary animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Secure Admin Environment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
