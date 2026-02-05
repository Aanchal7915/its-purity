import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Activity, ShieldCheck, Microscope, ArrowRight, CheckCircle2, FlaskConical, ClipboardList, Package } from 'lucide-react';

const CustomizedSolutionPage = () => {
    const [activeStep, setActiveStep] = useState(1);

    const steps = [
        {
            id: 1,
            title: "Interactive Assessment",
            description: "Our advanced algorithm analyzes your unique biomarkers, lifestyle habits, and wellness goals through a comprehensive digital evaluation.",
            icon: <ClipboardList className="w-6 h-6" />,
            image: "/assets/images/custom-solution/consultation.png"
        },
        {
            id: 2,
            title: "Precision Formulation",
            description: "Based on your data, our doctors and pharmaceutical experts curate a precise blend of high-potency ingredients tailored specifically for you.",
            icon: <FlaskConical className="w-6 h-6" />,
            image: "/assets/images/custom-solution/hero.png"
        },
        {
            id: 3,
            title: "Direct Delivery",
            description: "Your personalized wellness ritual is compounded fresh and delivered in eco-friendly, premium packaging directly to your doorstep.",
            icon: <Package className="w-6 h-6" />,
            image: "/assets/images/custom-solution/grid.png"
        }
    ];

    const benefits = [
        {
            title: "Pharma-Grade Purity",
            tagline: "Absolute Transparency",
            desc: "Every raw material undergoes rigorous 3rd-party HPLC testing. We source only crystalline-grade botanical extracts from high-altitude environments for maximum phytochemical density.",
            image: "/assets/images/custom-solution/purity.png",
            points: ["Zero Synthetic Fillers", "Heavy Metal Scanned", "Cold-Pressed Extracts"]
        },
        {
            title: "Evidence-Based",
            tagline: "Proven Efficacy",
            desc: "Our formulations are designed using molecular docking simulations. We use clinically-validated dosages that match successful human trials, ensuring the ritual actually works.",
            image: "/assets/images/custom-solution/evidence.png",
            points: ["Doctor Formulated", "Clinical Trial Dosing", "Molecular Synergy"]
        },
        {
            title: "Bio-Adaptive",
            tagline: "Cellular Recognition",
            desc: "Nutrients are engineered for bio-identity, using advanced liposomal delivery systems that bypass digestive degradation for direct cellular uptake.",
            image: "/assets/images/custom-solution/bioadaptive.png",
            points: ["Liposomal Delivery", "High Bio-availability", "Natural Co-factors"]
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center overflow-hidden bg-white">
                <div className="absolute inset-0 z-0 flex justify-end">
                    <div className="w-full lg:w-[70%] h-full relative">
                        <img
                            src="/assets/images/custom-solution/hero.png"
                            alt="Personalized Wellness"
                            className="w-full h-full object-cover"
                        />
                        {/* Smooth transition from white to image */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent"></div>
                    </div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-12 h-[1px] bg-purevit-primary"></span>
                            <span className="text-purevit-primary font-bold tracking-[0.3em] text-[10px] uppercase">Bespoke Rituals</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-serif text-purevit-dark leading-tight mb-8">
                            Your Science. <br />
                            <span className="italic text-purevit-primary">Your Solution.</span>
                        </h1>
                        <p className="text-lg text-gray-500 mb-10 leading-relaxed font-medium">
                            We transcend generic nutrition. Our laboratory crafts bio-individualized
                            formulations tailored to your genetic blueprints and lifestyle demands.
                            Elevate your wellbeing with precision.
                        </p>
                        <div className="flex gap-6">
                            <Link to="/about" className="px-10 py-5 bg-purevit-dark text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-all flex items-center gap-3">
                                Our Story <ArrowRight size={16} />
                            </Link>
                            <Link to="/contact" className="px-10 py-5 border border-gray-100 text-purevit-dark rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all">
                                Learn More
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section - New Attractive Cards */}
            <section className="py-32 bg-[#fafafa]">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {benefits.map((benefit, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2, duration: 0.6 }}
                                className="group bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-gray-100 flex flex-col h-full"
                            >
                                {/* Image Header */}
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={benefit.image}
                                        alt={benefit.title}
                                        className="w-full h-full object-cover"
                                    />

                                    <div className="absolute bottom-6 left-8">
                                        <span className="text-purevit-primary font-black uppercase tracking-[.2em] text-[10px] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
                                            {benefit.tagline}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div className="p-10 flex flex-col flex-grow">
                                    <h3 className="text-3xl font-serif text-purevit-dark mb-4 italic group-hover:text-purevit-primary transition-colors">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-500 font-medium leading-relaxed mb-8 text-sm">
                                        {benefit.desc}
                                    </p>

                                    {/* Detailed Points */}
                                    <div className="space-y-3 mt-auto border-t border-gray-50 pt-8">
                                        {benefit.points.map((point, pIdx) => (
                                            <div key={pIdx} className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 bg-purevit-primary/40 rounded-full" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-600 transition-colors">
                                                    {point}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Process Section */}
            <section className="pt-16 pb-32 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl font-serif text-purevit-dark mb-6">Crafting Your <span className="italic">Personalized Bottle</span></h2>
                        <p className="text-gray-500 max-w-2xl mx-auto font-medium">A seamless journey from biological insight to pharmaceutical excellence.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-6">
                            {steps.map((step) => (
                                <div
                                    key={step.id}
                                    onClick={() => setActiveStep(step.id)}
                                    className={`p-10 rounded-[40px] cursor-pointer transition-all duration-500 flex gap-8 border group ${activeStep === step.id
                                        ? 'bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border-purevit-primary/20'
                                        : 'bg-gray-50/50 border-gray-100 hover:bg-white hover:border-purevit-primary/10 hover:shadow-xl'
                                        }`}
                                >
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 ${activeStep === step.id
                                        ? 'bg-purevit-primary text-white scale-110 shadow-lg shadow-purevit-primary/20'
                                        : 'bg-white text-gray-400 group-hover:text-purevit-primary'
                                        }`}>
                                        {React.cloneElement(step.icon, { size: 28 })}
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className={`text-2xl font-serif italic transition-colors ${activeStep === step.id ? 'text-purevit-dark' : 'text-gray-400 group-hover:text-purevit-dark'}`}>
                                            {step.title}
                                        </h4>
                                        <p className={`text-sm leading-relaxed font-medium transition-colors ${activeStep === step.id ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="relative">
                            <div className="aspect-square rounded-[60px] overflow-hidden bg-gray-100 shadow-2xl">
                                <motion.img
                                    key={activeStep}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                    src={steps.find(s => s.id === activeStep).image}
                                    alt="Process Illustration"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Floating Badge */}
                            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[30px] shadow-2xl border border-gray-100 max-w-xs animate-bounce-slow">
                                <div className="flex items-center gap-4 mb-3">
                                    <Sparkles className="text-purevit-primary" size={24} />
                                    <span className="text-xs font-black uppercase tracking-widest text-purevit-dark">Laboratory Verified</span>
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed">
                                    Every batch is tested for bio-availability and ingredient synergy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Elegant Cream Theme */}
            <section className="pt-16 pb-20 bg-[#FDFCF0] relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purevit-primary/5 rounded-full blur-[120px]"></div>
                </div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-5xl md:text-7xl font-serif text-purevit-dark mb-10 leading-tight">
                        Ready to meet your <br />
                        <span className="italic text-purevit-primary">perfect formula?</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                        Join thousands of individuals who have unlocked their potential with
                        precise, science-backed nutrition. Your journey starts with a simple assessment.
                    </p>
                    <Link to="/contact" className="px-16 py-6 bg-purevit-primary text-black rounded-full font-black uppercase tracking-[0.3em] text-[10px] hover:scale-105 transition-all shadow-[0_15px_30px_rgba(34,197,94,0.2)]">
                        Contact us
                    </Link>

                    <div className="mt-16 flex justify-center gap-12 text-gray-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-purevit-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Cruelty Free</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-purevit-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Lab Tested</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-purevit-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Non GMO</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CustomizedSolutionPage;
