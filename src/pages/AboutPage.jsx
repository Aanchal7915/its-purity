import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Plus, Phone, Mail, FlaskConical, Globe2, Leaf, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    // Ticker items
    const tickerItems = [
        "Clinical Excellence",
        "Pure Ingredients",
        "Lab Certified",
        "Sustainable Sourcing",
        "Immunity Support",
        "Energy Optimization",
    ];

    return (
        <div className="min-h-screen bg-white selection:bg-purevit-primary selection:text-black font-sans">

            {/* 1. HEADER SECTION (Two Columns) */}
            <section className="pt-10 md:pt-16 pb-6 md:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-end">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Who we are</span>
                        <h1 className="text-3xl md:text-7xl font-serif text-purevit-dark leading-[1.1] font-medium">
                            We are specialists <br className="hidden md:block" /> in the health field
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:max-w-md lg:ml-auto space-y-4 md:space-y-8"
                    >
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Our services cover a wide range of nutritional needs, from crafting bespoke supplements to rigorous testing of every raw ingredient that enters our lab.
                        </p>
                        <div className="flex items-center gap-3 md:gap-6 flex-nowrap">
                            <Link to="/products" className="bg-purevit-dark text-white px-4 md:px-6 py-3 rounded-md text-xs font-bold hover:bg-black transition-all whitespace-nowrap">
                                Shop Now
                            </Link>
                            <Link to="/contact" className="text-purevit-dark text-xs font-bold border-b border-purevit-dark pb-0.5 hover:text-black transition-all whitespace-nowrap">
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. HERO IMAGE (Large Horizontal) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-[250px] md:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl relative"
                >
                    <img
                        src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1600&q=80"
                        alt="Purevit Scientific Research"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/5"></div>
                </motion.div>
            </section>

            {/* 3. TICKER BAR (Purevit Dark) */}
            <div className="bg-purevit-dark py-4 md:py-6 overflow-hidden flex whitespace-nowrap">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="flex items-center gap-12 text-white/90 text-sm font-bold uppercase tracking-[0.2em]"
                >
                    {/* Double the items for seamless loop */}
                    {[...tickerItems, ...tickerItems].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                            <Star size={16} fill="white" className="text-white" />
                            <span>{item}</span>
                        </div>
                    ))}
                </motion.div>
            </div>



            {/* 4. STATS SECTION (Beige Background) */}
            <section className="bg-[#f5f0e6] py-12 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start mb-10 md:mb-20">
                        <div className="space-y-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purevit-dark/60">Start with us</span>
                            <h2 className="text-3xl md:text-5xl font-serif text-purevit-dark leading-tight font-medium">
                                Straightforward health <br className="hidden md:block" /> services with no <br className="hidden md:block" /> hidden surprises
                            </h2>
                        </div>
                        <div className="space-y-8">
                            <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                At Purevit, we believe in providing clear and transparent health services that you can trust. Our experienced scientists are committed to offering personalized solutions, whether you're dealing with complex health goals or simple daily maintenance. We simplify the wellness process, making it easy to understand and navigate.
                            </p>
                            <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                Our team ensures that every client receives the most effective health strategies, all while building long-term relationships focused on achieving the best possible outcomes.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 pt-8 md:pt-12 border-t border-purevit-dark/10">
                        {[
                            { label: "Year Experience", val: "25 Years" },
                            { label: "Team Expert", val: "250+" },
                            { label: "Awards & Honor", val: "500+" },
                            { label: "Clients worldwide", val: "1000+" }
                        ].map((stat, idx) => (
                            <div key={idx} className="space-y-1 md:space-y-2 border-l border-purevit-dark/20 pl-3 md:pl-6 sm:first:border-l first:border-0">
                                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-purevit-dark/40 leading-tight">{stat.label}</p>
                                <p className="text-lg md:text-3xl font-serif text-purevit-dark font-medium">{stat.val}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4.5 THE FARM-TO-BOTTLE JOURNEY */}
            <section className="py-12 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-20 gap-6 md:gap-8">
                        <div className="space-y-2 md:space-y-4">
                            <span className="text-purevit-primary text-[10px] font-black uppercase tracking-[0.4em]">Transparency</span>
                            <h2 className="text-3xl md:text-6xl font-serif text-purevit-dark font-medium leading-[1.1]">The Farm-to-Bottle <br className="hidden md:block" /> Journey</h2>
                        </div>
                        <p className="max-w-md text-gray-500 text-sm leading-relaxed mb-2">
                            How we transform the earth's most potent raw materials into the pharmaceutical-grade supplements your body deserves.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[25px] left-[10%] right-[10%] h-px bg-gray-100 z-0"></div>

                        {[
                            { step: "01", title: "Ethical Sourcing", desc: "We partner with local farmers globally to source wild-crafted ingredients at peak potency." },
                            { step: "02", title: "Green Extraction", desc: "Using CO2-critical methods to preserve bio-active nutrients without harmful solvents." },
                            { step: "03", title: "Triple-Lab Testing", desc: "Every batch is tested for purity, heavy metals, and potency by independent laboratories." },
                            { step: "04", title: "Clean Packaging", desc: "100% recyclable amber glass ensures protection from UV light and plastic-free storage." }
                        ].map((item, i) => (
                            <div key={i} className="relative z-10 space-y-6">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purevit-dark text-white flex items-center justify-center text-[10px] md:text-xs font-bold ring-4 md:ring-8 ring-white">
                                    {item.step}
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-serif text-purevit-dark font-medium">{item.title}</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4.7 QUALITY STANDARDS STRIP (Seal of approval after Journey) */}
            <div className="bg-gradient-to-r from-[#f5f0e6] via-white to-[#f5f0e6] py-6 md:py-8 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-2 md:px-4 grid grid-cols-3 md:flex md:flex-wrap justify-center md:justify-between items-center gap-2 md:gap-6">
                    {["Non-GMO Project", "Certified Organic", "Lab Tested", "Cruelty Free", "ISO Certified", "100% Vegan"].map((label, i) => (
                        <div key={i} className="flex flex-col md:flex-row items-center gap-1 md:gap-3 px-2 md:px-4 py-2 rounded-xl md:rounded-full bg-white/80 shadow-sm border border-gray-100 text-center">
                            <Star size={12} className="text-purevit-primary md:w-[14px] md:h-[14px]" />
                            <span className="text-[7px] md:text-[10px] font-black uppercase tracking-wider md:tracking-[0.3em] text-purevit-dark leading-tight">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. TEAM SECTION - SOPHISTICATED GRID */}
            <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-10 md:mb-16">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-purevit-primary mb-2 md:mb-4 block">Meet Our Team</span>
                    <h2 className="text-3xl md:text-6xl font-serif text-purevit-dark leading-tight font-medium">
                        Guided by Expertise, <br className="hidden md:block" /> driven by <span className="italic">Passion</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[
                        {
                            name: "Dr. Ananya Sharma",
                            role: "Chief Scientist",
                            img: "https://images.unsplash.com/photo-1598257006626-48b0c252070d?auto=format&fit=crop&w=900&q=80",
                            bio: "Leading our clinical trials and ingredient verification with 20+ years in pharmacology."
                        },
                        {
                            name: "Dr. Rohan Mehta",
                            role: "Lead Nutritionist",
                            img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80",
                            bio: "Crafting bespoke nutritional strategies to optimize daily energy and immunity levels."
                        },
                        {
                            name: "Dr. Priya Iyer",
                            role: "Safety & Quality",
                            img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
                            bio: "Meticulously auditing our global supply chain to ensure zero contamination."
                        }
                    ].map((member, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="group relative"
                        >
                            <div className="aspect-[4/5] rounded-2xl md:rounded-[2rem] overflow-hidden mb-4 md:mb-8 relative bg-gray-100 shadow-lg">
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                {/* Glassmorphic Overlay Reveal */}
                                <div className="absolute inset-x-4 bottom-4 bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out z-20">
                                    <div className="h-1 w-8 bg-purevit-primary mb-3 rounded-full"></div>
                                    <p className="text-purevit-dark text-xs leading-relaxed font-medium">
                                        {member.bio}
                                    </p>
                                </div>
                                {/* Soft Vignette for contrast */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60"></div>
                            </div>

                            <div className="space-y-1">
                                <h4 className="text-2xl font-serif text-purevit-dark font-medium group-hover:text-purevit-primary transition-colors duration-300">
                                    {member.name}
                                </h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                    {member.role}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* MORE TO EXPLORE */}
                <div className="mt-10 md:mt-20 text-center border-t border-gray-100 pt-8 md:pt-12">
                    <h3 className="text-3xl md:text-7xl font-serif text-black font-medium mb-6 md:mb-10 select-none leading-none uppercase tracking-tighter">More to explore</h3>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 text-left">
                        {[
                            {
                                title: "Science & Innovation",
                                desc: "Our laboratory is where nature's secrets are decoded. We use advanced spectrometry to ensure bio-availability.",
                                icon: FlaskConical
                            },
                            {
                                title: "Global Sourcing",
                                desc: "From the peaks of the Himalayas to the Amazonian basins, we source only wild-crafted, potent raw materials.",
                                icon: Globe2
                            },
                            {
                                title: "Sustainability",
                                desc: "Our 'Green-Pledge' ensures 100% recyclable packaging and a carbon-neutral supply chain by 2026.",
                                icon: Leaf
                            },
                            {
                                title: "Community Impact",
                                desc: "We dedicate 5% of every purchase to pediatric nutrition programs in under-served regions across India.",
                                icon: HeartPulse
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="p-4 md:p-8 rounded-xl md:rounded-2xl bg-[#fcfbf9] border border-gray-100 hover:border-purevit-primary/30 hover:shadow-xl transition-all group"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white shadow-sm flex items-center justify-center text-purevit-dark border border-gray-50 mb-4 md:mb-6 group-hover:bg-purevit-dark group-hover:text-white transition-colors">
                                    {item.icon ? <item.icon size={16} className="md:w-5 md:h-5" /> : <Plus size={16} className="md:w-5 md:h-5" />}
                                </div>
                                <h4 className="text-sm md:text-xl font-serif text-purevit-dark font-medium mb-2 md:mb-4">{item.title}</h4>
                                <p className="text-gray-500 text-[10px] md:text-sm leading-relaxed line-clamp-3 md:line-clamp-none">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION (Minimalist) */}
            <section className="bg-[#163020] py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
                    <h2 className="text-2xl md:text-5xl font-serif text-white max-w-xl text-center md:text-left">
                        Take the first step towards a healthier lifestyle.
                    </h2>
                    <div className="flex gap-4">
                        <Link to="/products" className="bg-white text-[#163020] px-10 py-4 rounded-md font-bold text-xs hover:bg-[#f5f0e6] transition-all whitespace-nowrap">
                            Shop Now
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
