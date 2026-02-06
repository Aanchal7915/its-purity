import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck, ChevronLeft } from 'lucide-react';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(items);
    }, []);

    const updateCart = (newItems) => {
        setCartItems(newItems);
        localStorage.setItem('cartItems', JSON.stringify(newItems));
        window.dispatchEvent(new Event('cartUpdate'));
    };

    const removeFromCart = (id) => {
        const newItems = cartItems.filter((x) => x.product !== id);
        updateCart(newItems);
    };

    const updateQty = (id, qty) => {
        if (qty < 1) return;
        const newItems = cartItems.map((item) =>
            item.product === id ? { ...item, qty } : item
        );
        updateCart(newItems);
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-purevit-secondary flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-[3rem] p-16 md:p-24 text-center shadow-2xl border border-purevit-primary/5 max-w-2xl w-full">
                    <div className="w-24 h-24 bg-purevit-cream rounded-full flex items-center justify-center mx-auto mb-8 text-purevit-primary">
                        <ShoppingBag size={48} />
                    </div>
                    <h2 className="text-4xl font-serif text-purevit-dark mb-4">Your basket is waiting.</h2>
                    <p className="text-gray-500 mb-10 max-w-sm mx-auto">It seems your cart is empty. Explore our collection of premium supplements and start your journey to better health.</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-10 py-5 bg-purevit-dark text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-purevit-primary transition-all shadow-xl hover:-translate-y-1"
                    >
                        Explore Collections <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-purevit-secondary py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <Link to="/products" className="group flex items-center gap-2 text-gray-400 hover:text-purevit-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-4 transition-all duration-300">
                            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Collection
                        </Link>
                        <h1 className="text-6xl font-serif text-purevit-dark tracking-tight">Shopping <span className="text-purevit-primary italic">Cart</span></h1>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <ShieldCheck size={14} className="text-purevit-primary" /> 100% Secure Checkout
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item.product} className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-purevit-primary/5 flex flex-col md:flex-row gap-8 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-1 group">
                                <div className="w-full md:w-40 h-40 bg-purevit-cream rounded-2xl overflow-hidden shrink-0 border border-purevit-secondary shadow-inner">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <Link to={`/products/${item.product}`} className="text-2xl font-serif text-purevit-dark hover:text-purevit-primary transition-colors">
                                                {item.name}
                                            </Link>
                                            <button
                                                onClick={() => removeFromCart(item.product)}
                                                className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                            </button>
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                            Unit Price: <span className="text-purevit-primary font-outfit text-sm">₹{item.price}</span>
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center bg-purevit-secondary/30 p-2 rounded-2xl">
                                        <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-100">
                                            <button
                                                onClick={() => updateQty(item.product, item.qty - 1)}
                                                className="p-3 text-gray-400 hover:text-purevit-primary disabled:opacity-30"
                                                disabled={item.qty <= 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="px-4 text-sm font-black text-purevit-dark">{item.qty}</span>
                                            <button
                                                onClick={() => updateQty(item.product, item.qty + 1)}
                                                className="p-3 text-gray-400 hover:text-purevit-primary"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-right pr-4">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Total</p>
                                            <p className="text-2xl font-outfit text-purevit-dark font-semibold">₹{item.qty * item.price}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Shipping Promo */}
                        <div className="bg-purevit-cream rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-2 border-dashed border-purevit-primary/20">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-purevit-primary shadow-lg border border-purevit-primary/10">
                                    <Truck size={32} />
                                </div>
                                <div className="text-center md:text-left">
                                    <h4 className="text-2xl font-serif text-purevit-dark mb-1">Free Delivery Applied</h4>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Order will arrive in 3-5 business days</p>
                                </div>
                            </div>
                            <div className="px-8 py-3 bg-purevit-primary text-white shadow-lg shadow-purevit-primary/20 rounded-full text-[10px] font-black uppercase tracking-[0.25em] animate-pulse">
                                Premium Bonus
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-[3rem] p-10 text-purevit-dark shadow-[0_40px_80px_rgba(0,0,0,0.06)] border border-purevit-primary/5 relative overflow-hidden sticky top-24">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purevit-primary/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purevit-primary/5 blur-[80px] rounded-full -ml-32 -mb-32"></div>

                            <div className="relative z-10">
                                <h3 className="text-3xl font-serif mb-10 italic">Basket <span className="text-purevit-primary font-sans not-italic text-sm font-black uppercase tracking-[0.3em] ml-2">Summary</span></h3>

                                <div className="space-y-6 mb-10 relative z-10">
                                    <div className="flex justify-between items-center group/item transition-all duration-300">
                                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Subtotal</span>
                                        <span className="font-outfit text-xl font-medium text-purevit-dark">₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Shipping</span>
                                        <span className="bg-green-50 text-purevit-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100">Complimentary</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Tax (Included)</span>
                                        <span className="font-outfit text-xl font-medium text-purevit-dark">₹0</span>
                                    </div>
                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent w-full" />
                                    <div className="flex justify-between items-end pt-2">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purevit-primary block mb-1">Grand Total</span>
                                            <span className="text-3xl font-outfit font-bold text-purevit-dark leading-none tracking-tight">₹{subtotal}</span>
                                        </div>
                                        <div className="text-[10px] text-gray-400 font-medium italic">All taxes included</div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        const userInfo = localStorage.getItem('userInfo');
                                        if (userInfo) {
                                            navigate('/checkout');
                                        } else {
                                            navigate('/login?redirect=checkout');
                                        }
                                    }}
                                    className="w-full group relative py-4 bg-purevit-dark text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs overflow-hidden transition-all duration-500 shadow-xl hover:shadow-black/20 active:scale-95"
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-3">
                                        Checkout <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                    </div>
                                    <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                </button>

                                <p className="text-center mt-8 text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                                    All transactions are secure and encrypted.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
