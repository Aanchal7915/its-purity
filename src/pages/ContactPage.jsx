import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, ChevronRight, Globe, Instagram, Facebook, Linkedin } from 'lucide-react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [status, setStatus] = useState('idle'); // idle, sending, success

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    const contactInfo = [
        {
            icon: <Phone size={24} />,
            title: "Call Us",
            detail: "+91 1234567899",
            sub: "Mon-Sat, 9am - 8pm IST",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            icon: <Mail size={24} />,
            title: "Email Us",
            detail: "hello@its-purevit.com",
            sub: "Customised ritual support",
            color: "text-purevit-primary",
            bg: "bg-purevit-primary/5"
        },
        {
            icon: <MapPin size={24} />,
            title: "Our Laboratory",
            detail: "Sector 44, Dynamic House",
            sub: "Gurugram, HR 122003",
            color: "text-orange-600",
            bg: "bg-orange-50"
        }
    ];

    return (
        <div className="min-h-screen bg-purevit-secondary pt-16 md:pt-24 pb-10 md:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">

            {/* Background Decorative Elemets */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purevit-primary/5 blur-[120px] rounded-full -mr-48 -mt-24 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200/10 blur-[120px] rounded-full -ml-48 -mb-24 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header Section */}
                <div className="text-center mb-6 md:mb-20 space-y-4 md:space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 mb-4"
                    >
                        <div className="w-12 h-px bg-purevit-primary/30"></div>
                        <span className="text-purevit-primary text-[10px] font-black uppercase tracking-[0.4em]">Get in Touch</span>
                        <div className="w-12 h-px bg-purevit-primary/30"></div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-8xl font-serif text-purevit-dark leading-none"
                    >
                        Let's start your <br />
                        <span className="italic text-purevit-primary font-medium tracking-tight">Wellness Journey</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed text-sm md:text-lg italic"
                    >
                        Whether you have a question about our laboratory standards or need a personalized ritual guide, our experts are here to help.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start">

                    {/* Left Column: Contact Cards */}
                    <div className="lg:col-span-5 space-y-4 md:space-y-6 order-2 lg:order-1">
                        {contactInfo.map((info, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (idx * 0.1) }}
                                className="group bg-white rounded-xl md:rounded-3xl p-3 md:p-6 flex items-start gap-3 md:gap-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                            >
                                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-2xl flex items-center justify-center shrink-0 ${info.bg} ${info.color}`}>
                                    {React.cloneElement(info.icon, { size: 18 })}
                                </div>
                                <div>
                                    <p className="text-[9px] md:text-xs font-serif italic text-gray-500 mb-0.5 md:mb-1">{info.title}</p>
                                    <h3 className="text-[13px] md:text-lg font-sans font-semibold text-gray-800 mb-0.5 md:mb-1">{info.detail}</h3>
                                    <p className="text-[9px] md:text-xs text-gray-500 font-medium">{info.sub}</p>
                                </div>
                            </motion.div>
                        ))}

                        {/* Social Connect - Real Brand Colors */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 border border-gray-100 shadow-lg"
                        >
                            <h3 className="text-lg md:text-xl font-serif text-gray-800 mb-4 md:mb-6 italic">Join the Community</h3>
                            <div className="flex gap-3 md:gap-4">
                                <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300 shadow-sm border border-pink-100">
                                    <Instagram size={20} />
                                </a>
                                <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm border border-blue-100">
                                    <Facebook size={20} />
                                </a>
                                <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all duration-300 shadow-sm border border-blue-100">
                                    <Linkedin size={20} />
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-7 bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-12 shadow-xl border border-gray-100 order-1 lg:order-2"
                    >
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                                <div className="w-1.5 h-1.5 bg-purevit-primary rounded-full"></div>
                                <h2 className="text-xl md:text-2xl font-serif text-gray-800">Send an Inquiry</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                    <div className="space-y-1">
                                        <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="eg. Aria Vance"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 md:px-5 py-2.5 md:py-3.5 bg-gray-50 border border-transparent rounded-lg md:rounded-xl focus:bg-white focus:border-purevit-primary/50 focus:shadow-sm transition-all outline-none font-medium placeholder:text-gray-300 text-xs md:text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="aria@rituals.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 md:px-5 py-2.5 md:py-3.5 bg-gray-50 border border-transparent rounded-lg md:rounded-xl focus:bg-white focus:border-purevit-primary/50 focus:shadow-sm transition-all outline-none font-medium placeholder:text-gray-300 text-xs md:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="How can we help?"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 md:px-5 py-2.5 md:py-3.5 bg-gray-50 border border-transparent rounded-lg md:rounded-xl focus:bg-white focus:border-purevit-primary/50 focus:shadow-sm transition-all outline-none font-medium placeholder:text-gray-300 text-xs md:text-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Message</label>
                                    <textarea
                                        rows="3"
                                        required
                                        placeholder="Write your message here..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 md:px-5 py-3 bg-gray-50 border border-transparent rounded-lg md:rounded-xl focus:bg-white focus:border-purevit-primary/50 focus:shadow-sm transition-all outline-none font-medium placeholder:text-gray-300 resize-none text-xs md:text-sm"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="w-full py-3 md:py-4 bg-purevit-primary text-black rounded-lg md:rounded-xl font-bold uppercase tracking-widest text-[9px] md:text-[10px] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent' : 'Send Message'}
                                    <Send size={12} className="md:w-3.5 md:h-3.5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>

                {/* Map Section - Full Color */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-8 md:mt-24 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl h-[300px] md:h-[450px] relative border-4 border-white"
                >
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14030.730302820067!2d77.0683!3d28.4503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1901df4c4149%3A0xe675ca8241517789!2sSector%2044%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="transition-all duration-1000"
                    ></iframe>
                    <div className="absolute bottom-2 md:bottom-8 right-2 md:right-auto md:left-8 bg-white/95 backdrop-blur-sm p-2 md:p-6 rounded-xl md:rounded-3xl shadow-lg border border-gray-100 max-w-[150px] md:max-w-xs space-y-1 md:space-y-3">
                        <div className="w-7 h-7 md:w-10 md:h-10 bg-purevit-primary/10 rounded-full flex items-center justify-center text-purevit-primary">
                            <MapPin size={14} className="md:w-5 md:h-5" />
                        </div>
                        <div>
                            <h4 className="text-[12px] md:text-lg font-serif text-gray-900 italic">PureVit HQ</h4>
                            <p className="text-[8px] md:text-xs text-gray-500 font-medium mt-0.5 md:mt-1 leading-tight">Dynamic House, Sector 44, Gurugram.</p>
                        </div>
                        <button className="flex items-center gap-1 text-[7px] md:text-[10px] font-black uppercase tracking-widest text-purevit-primary hover:gap-3 transition-all">
                            Directions <ChevronRight size={10} />
                        </button>
                    </div>
                </motion.div>

                {/* FAQS Link / Trust Footer */}
                <div className="mt-8 md:mt-24 pt-8 md:pt-10 border-t border-purevit-primary/10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-purevit-primary shadow-sm">
                            <Globe size={24} />
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                            Serving over 12 countries with <br /> pharmaceutical grade rituals.
                        </div>
                    </div>
                    <div className="flex gap-10">
                        <button className="text-[10px] font-black uppercase tracking-[0.4em] text-purevit-dark hover:text-purevit-primary transition-colors">Safety Standards</button>
                        <button className="text-[10px] font-black uppercase tracking-[0.4em] text-purevit-dark hover:text-purevit-primary transition-colors">Ritual Returns</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
