import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, Shield, Brain, Activity, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
    {
        id: 1,
        title: "Back Your Strength with Proven Science.",
        subtitle: "Vitality Men - Total Wellness",
        description: "Experience the synergy of pharmaceutical-grade nutrients specifically formulated for men. Our unique blend optimizes metabolic health, cognitive function, and physical resilience, ensuring you stay at the peak of your performance every single day. Scientifically backed and purity-guaranteed.",
        image: "/src/assets/images/hero1.png",
        video: "/video.mp4",
        stats: [
            { label: "Energy", value: "30%", icon: <Zap size={20} /> },
            { label: "Immunity", value: "25%", icon: <Shield size={20} /> },
            { label: "Focus", value: "2X", icon: <Brain size={20} /> }
        ],
        theme: "blue"
    },
    {
        id: 2,
        title: "Purity You Can Feel, Results You Can See.",
        subtitle: "Aurum Omega - Pure Fish Oil",
        description: "Harness the power of the deep sea with our high-potency Omega-3 complex. By utilizing cold-water, wild-caught fish and advanced molecular distillation, we provide the cleanest EPA and DHA to support your cardiovascular health, inflammatory response, and neurological clarity. Pure. Potent. Proven.",
        image: "/src/assets/images/hero2.png",
        stats: [
            { label: "Heart", value: "Premium", icon: <Heart size={20} /> },
            { label: "Brain", value: "Power", icon: <Brain size={20} /> },
            { label: "Joint", value: "Care", icon: <Activity size={20} /> }
        ],
        theme: "gold"
    },
    {
        id: 3,
        title: "Naturally Radiant, Scientifically Shielded.",
        subtitle: "Pure Vit C - Immunity Boost",
        description: "Elevate your skin health and immune defenses with our Bio-Active Vitamin C. Infused with natural bioflavonoids to mirror nature's own delivery system, our formula ensures maximum cellular absorption and antioxidant protection against oxidative stress and environmental toxins.",
        image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1000&auto=format&fit=crop",
        stats: [
            { label: "Organic", value: "100%", icon: <Zap size={20} /> },
            { label: "Absorption", value: "Max", icon: <Activity size={20} /> },
            { label: "Glow", value: "Skin", icon: <Eye size={20} /> }
        ],
        theme: "orange"
    },
    {
        id: 4,
        title: "Peak Performance, Pure Recovery.",
        subtitle: "Elite Lean Protein - Muscle Fuel",
        description: "Fuel your muscles with the world's cleanest whey isolate. Designed for athletes who demand purity without compromise, our protein delivers a full spectrum of amino acids to accelerate muscle protein synthesis and cut down recovery time, helping you build a stronger, leaner physique faster.",
        image: "https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=1000&auto=format&fit=crop",
        stats: [
            { label: "Recovery", value: "Fast", icon: <Activity size={20} /> },
            { label: "Muscle", value: "Growth", icon: <Zap size={20} /> },
            { label: "Purity", value: "Lab", icon: <Shield size={20} /> }
        ],
        theme: "dark"
    },
    {
        id: 5,
        title: "Deep Rest for a Brighter Tomorrow.",
        subtitle: "Sleep Support - Natural Rest",
        description: "Transform your nights and reclaim your days with our non-habit forming sleep aid. By harmonizing with your body's natural circadian rhythm using calming botanicals and targeted minerals, we help you achieve deep, restorative REM sleep so you wake up feeling completely refreshed and energized.",
        image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1000&auto=format&fit=crop",
        stats: [
            { label: "Deep", value: "Sleep", icon: <Activity size={20} /> },
            { label: "Natural", value: "Rest", icon: <Shield size={20} /> },
            { label: "Wake", value: "Fresh", icon: <Zap size={20} /> }
        ],
        theme: "purple"
    },
    {
        id: 6,
        title: "Uncompromising Wellness for Every Day.",
        subtitle: "Daily Multi - Foundational Health",
        description: "Build your health on a solid foundation. Our Daily Multivitamin spans the gap between what you eat and what your body needs, providing a complete spectrum of 24 essential vitamins and minerals tailored for optimal absorption to support your energy, immunity, and overall longevity starting today.",
        image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=1000&auto=format&fit=crop",
        stats: [
            { label: "Balanced", value: "Nutri", icon: <Heart size={20} /> },
            { label: "Metabolism", value: "Boost", icon: <Zap size={20} /> },
            { label: "Cellular", value: "Repair", icon: <Shield size={20} /> }
        ],
        theme: "emerald"
    },
    {
        id: 7,
        title: "Guard Your Health with Nature's Best.",
        subtitle: "Immunity Shield - Advanced Defense",
        description: "Secure your wellness with our most advanced immunity defense system. We've combined the ancient wisdom of herbal medicine with cutting-edge clinical research to create a powerful shield against seasonal challenges, keeping your natural defense system alert, resilient, and ready for anything.",
        image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=1000&auto=format&fit=crop",
        stats: [
            { label: "Defense", value: "Strong", icon: <Shield size={20} /> },
            { label: "Wellness", value: "Total", icon: <Heart size={20} /> },
            { label: "Energy", value: "Level", icon: <Zap size={20} /> }
        ],
        theme: "red"
    }
];

const HeroCarousel = () => {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isMdUp, setIsMdUp] = useState(false);

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection) => {
        setDirection(newDirection);
        setCurrent((prev) => (prev + newDirection + slides.length) % slides.length);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1);
        }, 10000);
        return () => clearInterval(timer);
    }, [current]);

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 768px)');
        const handleChange = (e) => setIsMdUp(e.matches);
        setIsMdUp(mq.matches);
        if (mq.addEventListener) {
            mq.addEventListener('change', handleChange);
            return () => mq.removeEventListener('change', handleChange);
        }
        mq.addListener(handleChange);
        return () => mq.removeListener(handleChange);
    }, []);

    return (
        <section className="relative min-h-[calc(100vh-72px)] sm:min-h-[calc(100vh-80px)] md:min-h-[700px] w-full overflow-visible overflow-x-hidden md:overflow-hidden bg-purevit-secondary pt-4 sm:pt-6 md:pt-0">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={current}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.5 }
                    }}
                    drag={isMdUp ? "x" : false}
                    dragConstraints={isMdUp ? { left: 0, right: 0 } : undefined}
                    dragElastic={isMdUp ? 1 : 0}
                    onDragEnd={(e, { offset, velocity }) => {
                        if (!isMdUp) return;
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                    className="relative w-full h-full overflow-hidden md:absolute md:inset-0"
                >
                    <div className="relative w-full h-full flex items-center py-8 sm:py-10 md:pt-20 md:pb-28">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                                {/* Mobile Media */}
                                <div className="lg:hidden relative">
                                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
                                        {slides[current].video ? (
                                            <video
                                                src={slides[current].video}
                                                className="w-full h-full object-cover object-center scale-[1.08] origin-center"
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                            />
                                        ) : (
                                            <img
                                                src={slides[current].image}
                                                alt={slides[current].subtitle}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-purevit-dark/5"></div>
                                    </div>
                                </div>
                                {/* Text Content */}
                                <div className="lg:col-span-7 space-y-2 md:space-y-8 z-10 text-center lg:text-left pt-2 md:pt-0">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex items-center gap-3 justify-center lg:justify-start"
                                    >
                                        <span className="text-[6px] md:text-[10px] font-black uppercase tracking-[0.3em] text-purevit-primary">
                                            {slides[current].subtitle}
                                        </span>
                                        <div className="h-px w-10 bg-gray-200"></div>
                                    </motion.div>

                                    <motion.h1
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-3xl md:text-6xl lg:text-6xl font-serif text-purevit-dark leading-tight"
                                    >
                                        {slides[current].title}
                                    </motion.h1>

                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-gray-500 text-xs md:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
                                    >
                                        {slides[current].description}
                                    </motion.p>

                                    {/* Stats Grid */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex flex-wrap gap-4 md:gap-8 justify-center lg:justify-start py-4"
                                    >
                                        {slides[current].stats.map((stat, idx) => (
                                            <div key={idx} className="flex flex-col items-center gap-2 group">
                                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-purevit-primary/20 flex items-center justify-center text-purevit-primary group-hover:bg-purevit-primary group-hover:text-white transition-all duration-300">
                                                    {stat.icon}
                                                </div>
                                                <span className="text-lg md:text-xl font-bold text-purevit-dark">{stat.value}</span>
                                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</span>
                                            </div>
                                        ))}
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="flex flex-row w-full md:w-auto gap-3 md:gap-6 justify-center lg:justify-start "
                                    >
                                        <Link to="/products" className="flex-1 md:flex-none text-center px-4 py-3 md:px-10 md:py-5 bg-purevit-dark hover:bg-black text-white font-bold rounded-md transition-all text-[10px] md:text-xs tracking-widest uppercase shadow-xl whitespace-nowrap">
                                            Shop Collection
                                        </Link>
                                        <Link to="/about" className="flex-1 md:flex-none text-center px-4 py-3 md:px-10 md:py-5 border border-purevit-dark/10 hover:bg-gray-50 text-purevit-dark font-bold rounded-md transition-all text-[10px] md:text-xs tracking-widest uppercase whitespace-nowrap">
                                            Learn More
                                        </Link>
                                    </motion.div>
                                </div>

                                {/* Image Side */}
                                <div className="hidden lg:block lg:col-span-5 relative">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        transition={{ delay: 0.4, duration: 0.8 }}
                                        className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl"
                                    >
                                        {slides[current].video ? (
                                            <video
                                                src={slides[current].video}
                                                className="w-full h-full object-cover object-center scale-[1.08] origin-center"
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                            />
                                        ) : (
                                            <img
                                                src={slides[current].image}
                                                alt={slides[current].subtitle}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-purevit-dark/5"></div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            {/* Centered Dots */}
            <div className="w-full hidden md:flex absolute inset-x-0 bottom-8 md:bottom-6 flex justify-center items-center z-30 pointer-events-none">
                <div className="flex gap-3 px-6 py-3 rounded-full backdrop-blur-md bg-white/10 border border-white/10 shadow-lg">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setDirection(idx > current ? 1 : -1);
                                setCurrent(idx);
                            }}
                            className={`h-2 rounded-full transition-all duration-500 ${current === idx ? 'w-12 bg-purevit-primary' : 'w-2 bg-gray-400/50 hover:bg-purevit-primary/50'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Side Arrows */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between items-center w-full px-2 md:px-8 pointer-events-none z-30">
                <button
                    onClick={() => paginate(-1)}
                    className="w-8 h-8 md:w-14 md:h-14 rounded-full border border-purevit-dark/10 flex items-center justify-center text-purevit-dark hover:bg-purevit-dark hover:text-white transition-all group backdrop-blur-md bg-white/30 pointer-events-auto shadow-xl"
                >
                    <ChevronLeft size={16} className="md:hidden group-hover:-translate-x-1 transition-transform" />
                    <ChevronLeft size={28} className="hidden md:block group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                    onClick={() => paginate(1)}
                    className="w-8 h-8 md:w-14 md:h-14 rounded-full border border-purevit-dark/10 flex items-center justify-center text-purevit-dark hover:bg-purevit-dark hover:text-white transition-all group backdrop-blur-md bg-white/30 pointer-events-auto shadow-xl"
                >
                    <ChevronRight size={16} className="md:hidden group-hover:translate-x-1 transition-transform" />
                    <ChevronRight size={28} className="hidden md:block group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purevit-primary/5 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-gray-200/20 to-transparent pointer-events-none"></div>
        </section>
    );
};

export default HeroCarousel;
