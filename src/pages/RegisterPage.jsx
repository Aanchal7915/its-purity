import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ShieldCheck } from 'lucide-react';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get('redirect') ? `/${searchParams.get('redirect').replace(/^\//, '')}` : '/';

    useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            navigate(redirect);
        }
    }, [navigate, redirect]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post('http://localhost:5002/api/auth/register', { name, email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-purevit-secondary py-20 px-4">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-purevit-primary/5">
                <div className="hidden lg:flex flex-col justify-center p-16 bg-purevit-cream text-purevit-dark relative overflow-hidden border-r border-purevit-primary/10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purevit-primary/10 blur-[120px] rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purevit-primary/5 blur-[120px] rounded-full -ml-20 -mb-20"></div>

                    {/* Decorative Organic Shapes */}
                    <div className="absolute top-3/4 right-10 opacity-10 -rotate-12">
                        <svg width="150" height="150" viewBox="0 0 120 120" fill="currentColor" className="text-purevit-primary">
                            <path d="M60 0C60 0 60 40 100 40C100 40 60 40 60 80C60 80 60 40 20 40C20 40 60 40 60 0Z" />
                        </svg>
                    </div>

                    <Link to="/" className="mb-12 relative z-10 transition-transform hover:scale-105 inline-block">
                        <span className="text-4xl font-serif font-bold tracking-tight">
                            <span className="text-purevit-dark">Pure</span>
                            <span className="text-purevit-primary">vit</span>
                        </span>
                    </Link>

                    <div className="relative z-10">
                        <h1 className="text-6xl font-serif mb-8 leading-tight">Start Your <br /><span className="italic text-purevit-primary underline decoration-purevit-primary/20 underline-offset-8">Pure Journey.</span></h1>
                        <p className="text-gray-500 text-lg mb-12 max-w-md leading-relaxed">Join thousands of health enthusiasts who trust PureVit for their daily nutritional needs. Experience laboratory-grade supplements delivered to your door.</p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-5 group">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-purevit-primary/10 flex items-center justify-center text-purevit-primary shadow-sm group-hover:bg-purevit-primary group-hover:text-white transition-all duration-500">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <span className="block text-sm font-black uppercase tracking-widest text-purevit-dark/40">Pure Promise</span>
                                    <span className="text-sm font-bold text-purevit-dark">100% Organic & Lab Tested</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Register Form */}
                <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-center">
                    <div className="max-w-md w-full mx-auto">
                        <div className="mb-10">
                            <h2 className="text-4xl font-serif text-purevit-dark mb-2">Join PureVit</h2>
                            <p className="text-gray-500">Create an account for personalized wellness tips and faster checkout.</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-8 flex items-center gap-3 border border-red-100 animate-shake">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-purevit-dark/60 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-purevit-secondary/50 border border-purevit-primary/10 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-purevit-dark/60 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-purevit-secondary/50 border border-purevit-primary/10 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-purevit-dark/60 ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-purevit-secondary/50 border border-purevit-primary/10 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-purevit-dark/60 ml-1">Confirm</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-purevit-secondary/50 border border-purevit-primary/10 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark text-sm"
                                            required
                                        />
                                    </div>
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
                                            <UserPlus size={20} className="text-purevit-primary" />
                                            <span>Create Free Account</span>
                                        </>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-purevit-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-gray-500 font-medium">
                                Already part of the community?{' '}
                                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-purevit-primary font-black ml-1 hover:underline">
                                    Log In Here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
