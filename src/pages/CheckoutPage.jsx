import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Truck, ChevronLeft, ShieldCheck, ShoppingBag, MapPin, ReceiptText, LockKeyhole, ArrowRight } from 'lucide-react';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', country: 'India', phone: '' });
    const [userNotes, setUserNotes] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
        } else if (!userInfo) {
            navigate('/login?redirect=checkout');
        }
    }, [navigate, cartItems.length, userInfo]);

    if (cartItems.length === 0 || !userInfo) {
        return null;
    }

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const orderData = {
                orderItems: cartItems,
                shippingAddress: address,
                paymentMethod: 'COD',
                itemsPrice: subtotal,
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: subtotal,
                userNotes: userNotes
            };

            await axios.post('http://localhost:5002/api/orders', orderData, config);

            localStorage.removeItem('cartItems');
            alert('Order Placed Successfully!');
            navigate('/dashboard'); // Go to dashboard/orders
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || error.message || 'Order failed';
            alert(`Order Failed: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-purevit-secondary py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="space-y-4">
                        <Link to="/cart" className="flex items-center gap-2 text-gray-400 hover:text-purevit-dark font-bold text-[10px] uppercase tracking-[0.3em] transition-colors">
                            <ChevronLeft size={16} /> Edit Basket
                        </Link>
                        <h1 className="text-6xl font-serif text-purevit-dark leading-none">Order <br /><span className="italic text-purevit-primary">Completion.</span></h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Shipping & Payment Information */}
                    <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-10Order">
                        <form onSubmit={submitHandler} className="space-y-10">

                            {/* Step 1: Shipping */}
                            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-purevit-primary/5">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 rounded-2xl bg-purevit-cream flex items-center justify-center text-purevit-dark">
                                        <MapPin size={22} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-serif text-purevit-dark">Shipping Details</h2>
                                        <p className="text-gray-400 text-sm">Where should we deliver your wellness rituals?</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-purevit-dark/40 ml-1">Street Address</label>
                                        <input
                                            type="text"
                                            value={address.street}
                                            onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                            placeholder="Building, Street Name, Landmark"
                                            className="w-full px-5 py-4 bg-purevit-secondary/30 border border-purevit-primary/5 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-purevit-dark/40 ml-1">City</label>
                                        <input
                                            type="text"
                                            value={address.city}
                                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                            className="w-full px-5 py-4 bg-purevit-secondary/30 border border-purevit-primary/5 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-purevit-dark/40 ml-1">State</label>
                                        <input
                                            type="text"
                                            value={address.state}
                                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                            className="w-full px-5 py-4 bg-purevit-secondary/30 border border-purevit-primary/5 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-purevit-dark/40 ml-1">ZIP / Postal Code</label>
                                        <input
                                            type="text"
                                            value={address.zip}
                                            onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                                            className="w-full px-5 py-4 bg-purevit-secondary/30 border border-purevit-primary/5 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-purevit-dark/40 ml-1">Destination Country</label>
                                        <input
                                            type="text"
                                            value={address.country}
                                            onChange={(e) => setAddress({ ...address, country: e.target.value })}
                                            className="w-full px-5 py-4 bg-purevit-secondary/30 border border-purevit-primary/5 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-purevit-dark/40 ml-1">Primary Contact Number</label>
                                        <input
                                            type="text"
                                            value={address.phone}
                                            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                            placeholder="+91"
                                            className="w-full px-5 py-4 bg-purevit-secondary/30 border border-purevit-primary/5 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Payment */}
                            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-purevit-primary/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purevit-primary/5 blur-3xl rounded-full"></div>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 rounded-2xl bg-purevit-cream flex items-center justify-center text-purevit-dark">
                                        <CreditCard size={22} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-serif text-purevit-dark">Settlement</h2>
                                        <p className="text-gray-400 text-sm">Select your preferred method of exchange</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 p-8 border-2 border-purevit-primary bg-purevit-primary/5 rounded-[2rem] shadow-sm relative group transition-all duration-300 active:scale-[0.99]">
                                    <div className="w-6 h-6 rounded-full border-2 border-purevit-primary flex items-center justify-center">
                                        <div className="w-3 h-3 rounded-full bg-purevit-primary" />
                                    </div>
                                    <div className="flex-grow">
                                        <span className="block text-lg font-bold text-purevit-dark">Cash on Delivery (COD)</span>
                                        <span className="text-xs text-purevit-primary font-black uppercase tracking-widest">Pay in person upon delivery</span>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="flex items-center gap-4 text-gray-300">
                                            <ShieldCheck size={32} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: Final Notes & Submit */}
                            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-purevit-primary/5">
                                <h2 className="text-2xl font-serif text-purevit-dark mb-4">Delivery Notes <span className="text-xs font-sans font-bold text-gray-300 uppercase ml-2 tracking-widest">(Optional)</span></h2>
                                <textarea
                                    rows="3"
                                    placeholder="Any special instructions for the carrier?"
                                    value={userNotes}
                                    onChange={(e) => setUserNotes(e.target.value)}
                                    className="w-full px-6 py-5 bg-purevit-secondary/30 border border-purevit-primary/5 rounded-2xl focus:bg-white focus:border-purevit-primary transition-all outline-none font-medium text-purevit-dark text-sm mb-10"
                                ></textarea>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full group relative py-7 bg-purevit-dark hover:bg-black text-white rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-xs overflow-hidden transition-all duration-500 shadow-2xl active:scale-[0.98] disabled:opacity-50"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-4">
                                        {loading ? "Confirming Order..." : <>Complete Purchase · ₹{subtotal} <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" /></>}
                                    </span>
                                    <div className="absolute inset-0 bg-purevit-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                </button>

                                <div className="mt-8 flex items-center justify-center gap-3 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <LockKeyhole size={14} className="text-purevit-primary" /> Secure End-to-End Encryption
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right: Order Summary Sticky Card */}
                    <div className="lg:col-span-12 xl:col-span-4 max-w-xl xl:max-w-none w-full mx-auto">
                        <div className="bg-white rounded-[2.5rem] p-10 text-purevit-dark shadow-2xl sticky top-24 overflow-hidden group border border-purevit-primary/5">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purevit-primary/5 blur-[100px] rounded-full"></div>

                            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-purevit-primary/10">
                                <div className="w-12 h-12 rounded-2xl bg-purevit-cream flex items-center justify-center text-purevit-primary">
                                    <ReceiptText size={22} />
                                </div>
                                <h3 className="text-2xl font-serif text-purevit-dark">Basket Review</h3>
                            </div>

                            <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                                {cartItems.map((item) => (
                                    <div key={item.product} className="flex gap-5 group/item">
                                        <div className="w-20 h-20 rounded-2xl bg-purevit-secondary/30 border border-purevit-primary/5 shrink-0 overflow-hidden transform group-hover/item:scale-105 transition-transform">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="min-w-0 flex-grow flex flex-col justify-center">
                                            <h4 className="text-sm font-bold truncate group-hover/item:text-purevit-primary transition-colors">{item.name}</h4>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Qty: {item.qty} · ₹{item.price}</p>
                                        </div>
                                        <div className="text-right flex flex-col justify-center">
                                            <span className="font-serif text-lg text-purevit-dark">₹{item.price * item.qty}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-10 border-t border-purevit-primary/10">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sub-Total</span>
                                    <span className="font-serif text-lg text-purevit-dark">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Logistics Cost</span>
                                    <span className="text-purevit-primary text-[10px] font-black uppercase tracking-widest">Complimentary</span>
                                </div>
                                <div className="h-px bg-purevit-primary/10 w-full mt-4" />
                                <div className="flex justify-between items-end pt-4">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-purevit-primary">Payable Amount</span>
                                    <span className="text-4xl font-outfit font-bold text-purevit-dark">₹{subtotal}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
