import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-purevit-dark pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
                    <div className="md:col-span-5 space-y-8">
                        <Link to="/" className="flex items-center gap-4 group">
                            <div className="bg-white p-1.5 rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-110">
                                <img
                                    src="/assets/images/logo.png"
                                    alt="Purevit"
                                    className="h-14 w-auto object-contain"
                                />
                            </div>
                            <span className="text-3xl font-serif font-semibold tracking-tight text-white group-hover:text-purevit-primary transition-colors">
                                Purevit
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed font-medium max-w-sm">
                            Crafting pharmaceutical-grade nutrition with absolute transparency. Backed by nature, proven by clinical science.
                        </p>
                    </div>

                    <div className="md:col-span-2 space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Explore</h4>
                        <ul className="space-y-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <li><Link to="/" className="hover:text-purevit-primary transition-colors">Home</Link></li>
                            <li><Link to="/products" className="hover:text-purevit-primary transition-colors">Shop All</Link></li>
                            <li><Link to="/customized-solution" className="hover:text-purevit-primary transition-colors">Customized Solution</Link></li>
                            <li><Link to="/about" className="hover:text-purevit-primary transition-colors">Our Story</Link></li>
                            <li><Link to="/contact" className="hover:text-purevit-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Support</h4>
                        <ul className="space-y-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <li><Link to="/contact" className="hover:text-purevit-primary transition-colors">Contact</Link></li>
                            <li><Link to="/shipping-and-refund" className="hover:text-purevit-primary transition-colors">Shipping</Link></li>
                            <li><Link to="/privacy-policy" className="hover:text-purevit-primary transition-colors">Privacy</Link></li>
                            <li><Link to="/terms-and-conditions" className="hover:text-purevit-primary transition-colors">Terms</Link></li>
                            <li><Link to="/sitemap" className="hover:text-purevit-primary transition-colors">Sitemap</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-3 space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Social</h4>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
                        &copy; {new Date().getFullYear()} Purevit Scientific. All rights reserved.
                    </p>
                    <div className="h-px flex-grow bg-white/5 mx-8 hidden md:block"></div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
