import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, ArrowLeft, ShieldCheck, KeyRound, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Step 1: Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post('http://localhost:5002/api/auth/forgot-password', { email });
            setMessage(data.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5002/api/auth/verify-otp', { email, otp });
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5002/api/auth/reset-password', { email, otp, password });
            setStep(4);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-purevit-secondary py-20 px-4">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-purevit-primary/5">

                {/* Left Side: Branding & Trust */}
                <div className="hidden lg:flex flex-col justify-center p-16 bg-purevit-cream text-purevit-dark relative overflow-hidden border-r border-purevit-primary/10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purevit-primary/10 blur-[120px] rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purevit-primary/5 blur-[120px] rounded-full -ml-20 -mb-20"></div>

                    {/* Decorative Organic Shape */}
                    <div className="absolute top-1/2 right-0 opacity-10 rotate-45">
                        <svg width="200" height="200" viewBox="0 0 120 120" fill="currentColor" className="text-purevit-primary">
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
                        <h1 className="text-5xl font-serif mb-8 leading-tight">Secure Your <br /><span className="italic text-purevit-primary underline decoration-purevit-primary/20 underline-offset-8">Account.</span></h1>
                        <p className="text-gray-500 text-lg mb-12 max-w-md leading-relaxed">Protecting your data and privacy is our top priority. Follow the simple steps to securely reset your PureVit password.</p>

                        <div className="space-y-8">
                            {[
                                { icon: <Mail size={22} />, title: "One-Time Passcode", desc: "Sent securely to your email" },
                                { icon: <ShieldCheck size={22} />, title: "Safe & Encrypted", desc: "256-bit SSL protection" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-purevit-primary/10 flex items-center justify-center text-purevit-primary shadow-sm group-hover:bg-purevit-primary group-hover:text-white transition-all duration-500">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <span className="block text-sm font-black uppercase tracking-widest text-purevit-dark/40">{item.title}</span>
                                        <span className="text-sm font-bold text-purevit-dark">{item.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Recovery Flow */}
                <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center">
                    <div className="max-w-md w-full mx-auto">

                        {/* Back Link */}
                        {step < 4 && (
                            <Link to="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-purevit-primary mb-8 font-bold text-xs uppercase tracking-widest transition-colors group">
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Back to Log In
                            </Link>
                        )}

                        <div className="mb-10">
                            <h2 className="text-4xl font-serif text-purevit-dark mb-2">
                                {step === 1 && 'Account Recovery'}
                                {step === 2 && 'Verification Code'}
                                {step === 3 && 'New Credentials'}
                                {step === 4 && 'Recovery Success'}
                            </h2>
                            <p className="text-gray-500">
                                {step === 1 && "Enter your email to receive a recovery code."}
                                {step === 2 && `Code sent to ${email}`}
                                {step === 3 && "Create a secure new password."}
                                {step === 4 && "Your password has been reset."}
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-8 flex items-center gap-3 border border-red-100 text-sm font-medium animate-shake">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                {error}
                            </div>
                        )}

                        {/* Step 1: Email */}
                        {step === 1 && (
                            <form onSubmit={handleSendOTP} className="space-y-6">
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
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full group relative py-5 bg-purevit-dark hover:bg-black text-white rounded-[1.25rem] font-bold overflow-hidden transition-all duration-300 shadow-xl disabled:opacity-70"
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-2">
                                        {loading ? "Discovering Account..." : "Send Recovery Code"}
                                    </div>
                                    <div className="absolute inset-0 bg-purevit-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </button>
                            </form>
                        )}

                        {/* Step 2: OTP */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-center block text-purevit-dark/60">Enter 6-Digit OTP</label>
                                    <input
                                        type="text"
                                        maxLength="6"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="w-full text-center text-4xl tracking-[0.4em] py-5 bg-purevit-secondary/50 border border-purevit-primary/20 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-black text-purevit-dark"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className="w-full group relative py-5 bg-purevit-dark hover:bg-black text-white rounded-[1.25rem] font-bold overflow-hidden transition-all duration-300 shadow-xl disabled:opacity-70"
                                >
                                    <div className="relative z-10">Verify Code</div>
                                    <div className="absolute inset-0 bg-purevit-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </button>
                                <button type="button" onClick={handleSendOTP} className="w-full text-xs font-bold text-purevit-primary hover:underline text-center">
                                    Didn't receive? Resend Code
                                </button>
                            </form>
                        )}

                        {/* Step 3: New Password */}
                        {step === 3 && (
                            <form onSubmit={handleResetPassword} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-purevit-dark/60 ml-1">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-purevit-secondary/50 border border-purevit-primary/10 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-purevit-dark/60 ml-1">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-purevit-secondary/50 border border-purevit-primary/10 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark"
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full group relative py-5 bg-purevit-dark hover:bg-black text-white rounded-[1.25rem] font-bold overflow-hidden transition-all duration-300 shadow-xl"
                                >
                                    <div className="relative z-10">Activate New Password</div>
                                    <div className="absolute inset-0 bg-purevit-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </button>
                            </form>
                        )}

                        {/* Step 4: Success Message */}
                        {step === 4 && (
                            <div className="text-center py-10 space-y-6">
                                <div className="w-24 h-24 bg-purevit-primary/10 text-purevit-primary rounded-full flex items-center justify-center mx-auto border border-purevit-primary/20 shadow-inner">
                                    <CheckCircle2 size={48} />
                                </div>
                                <p className="text-purevit-primary font-black animate-pulse uppercase tracking-[0.2em] text-xs">Security Updated. Redirecting...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
