import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ShieldCheck, Zap, Heart, Brain, Share2, Bookmark, ArrowRight, Star, Mail } from 'lucide-react';

const articles = {
    "science-of-bioavailability": {
        title: "The Science of Bio-Availability",
        subtitle: "How Purevit ensures maximum absorption",
        image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80",
        readTime: "6 min read",
        category: "Research",
        content: [
            {
                type: "header",
                text: "Why Bio-Availability Matters"
            },
            {
                type: "paragraph",
                text: "Not all supplements are created equal. The most expensive vitamin in the world is the one your body can't absorb. Bio-availability refers to the proportion of a nutrient that is digested, absorbed, and metabolized through normal pathways. At Purevit, we've spent years engineering formulas that don't just 'contain' nutrients—they deliver them."
            },
            {
                type: "pullquote",
                text: "The most expensive vitamin in the world is the one your body can't absorb."
            },
            {
                type: "paragraph",
                text: "Our proprietary extraction techniques preserve the delicate biological structures of our raw materials. This ensures that when you take a Purevit supplement, your body recognizes the nutrient as a natural fuel source, leading to absorption rates up to 400% higher than industry standard extracts."
            },
            {
                type: "feature",
                icon: <Zap className="text-purevit-primary" />,
                title: "Molecular Synergy",
                text: "By pairing specific vitamins with co-factors found in nature (like Vitamin C with Acerola Bioflavonoids), we unlock metabolic gates that traditional isolated synthetics simply can't pass."
            },
            {
                type: "header",
                text: "The Purevit Protocol"
            },
            {
                type: "paragraph",
                text: "We utilize cold-process molecular distillation and liposomal delivery systems where necessary. These technologies wrap nutrients in a protective layer of phospholipids, allowing them to bypass the harsh environment of the stomach and be absorbed directly into the bloodstream."
            }
        ],
        relatedProducts: [
            { id: 1, name: "Daily Multivitamin", price: 45, image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80" },
            { id: 2, name: "Vitality Men", price: 55, image: "https://images.unsplash.com/photo-1471864190281-ad5fe9bb0724?auto=format&fit=crop&q=80" }
        ]
    },
    // Adding more data for others to ensure no crashes
    "personalized-wellness": {
        title: "Why One Size Does Not Fit All",
        subtitle: "The future of sustainable health",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80",
        readTime: "5 min read",
        category: "Wellness",
        content: [
            { type: "header", text: "Your Biological Fingerprint" },
            { type: "paragraph", text: "The human body is an incredibly complex system. Personalization is no longer just a trend; it's a scientific necessity. Our DNA determines how we process nutrients, and Purevit is at the forefront of adaptive supplementation." },
            { type: "pullquote", text: "Personalization is the bridge between health and peak performance." },
            { type: "feature", icon: <Brain className="text-purevit-primary" />, title: "Precision Dosing", text: "We use clinical data to determine the exact milligram requirements for optimal efficacy, eliminating the 'fillers' found in generic brands." }
        ],
        relatedProducts: [
            { id: 3, name: "Omega Pure", price: 65, image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80" }
        ]
    }
    // ... others follow similar patterns
};

const LearnArticlePage = () => {
    const { slug } = useParams();
    const article = articles[slug] || articles["science-of-bioavailability"];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!article) return <div className="py-40 text-center font-serif text-2xl">Article not found</div>;

    return (
        <div className="bg-[#fcfbf9] min-h-screen">
            {/* Immersive Column Header */}
            <header className="relative pt-40 pb-24 px-4 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        {/* Title Section */}
                        <div className="lg:col-span-8 space-y-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-4"
                            >
                                <Link to="/" className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-purevit-dark hover:bg-purevit-dark hover:text-white transition-all shadow-sm bg-white">
                                    <ArrowLeft size={20} />
                                </Link>
                                <span className="text-purevit-primary text-xs font-black uppercase tracking-[0.6em]">{article.category}</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-6"
                            >
                                <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-purevit-dark leading-[0.9] tracking-tighter">
                                    {article.title}
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-400 font-serif italic max-w-2xl leading-relaxed">
                                    &mdash; {article.subtitle}
                                </p>
                            </motion.div>

                            <div className="flex items-center gap-10 pt-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-100">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Expert" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-purevit-dark">Reviewed by</p>
                                    <p className="text-sm font-serif italic text-gray-500">Purevit Scientific Board</p>
                                </div>
                                <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
                                <div className="hidden md:block">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-purevit-dark">Reading Intensity</p>
                                    <p className="text-sm font-serif italic text-gray-500">{article.readTime}</p>
                                </div>
                            </div>
                        </div>

                        {/* Large Profile Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="lg:col-span-4"
                        >
                            <div className="relative aspect-[3/4] rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white">
                                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-purevit-primary/5 mix-blend-multiply"></div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Decorative background number */}
                <div className="absolute -top-20 -right-20 text-[25vw] font-serif text-gray-100/40 select-none pointer-events-none italic">
                    01
                </div>
            </header>

            {/* Main Editorial Body */}
            <main className="pb-40">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                        {/* Article Content Column */}
                        <div className="lg:col-span-8">
                            <article className="prose prose-2xl max-w-none space-y-12">
                                {article.content.map((item, idx) => {
                                    if (item.type === "header") return (
                                        <h2 key={idx} className="text-4xl md:text-5xl font-serif text-purevit-dark pt-12 border-t border-gray-100">
                                            {item.text}
                                        </h2>
                                    );
                                    if (item.type === "paragraph") return (
                                        <p key={idx} className={`text-xl md:text-2xl text-gray-600 leading-relaxed font-light ${idx === 1 ? 'first-letter:text-7xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-purevit-primary' : ''}`}>
                                            {item.text}
                                        </p>
                                    );
                                    if (item.type === "pullquote") return (
                                        <div key={idx} className="py-12 px-10 md:px-20 border-l-4 border-purevit-primary bg-white shadow-[20px_20px_60px_-15px_rgba(212,175,55,0.1)] rounded-r-3xl my-16">
                                            <blockquote className="text-3xl md:text-4xl font-serif text-purevit-dark italic leading-tight">
                                                "{item.text}"
                                            </blockquote>
                                        </div>
                                    );
                                    if (item.type === "feature") return (
                                        <div key={idx} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10 items-start group hover:border-purevit-primary/30 transition-all my-12">
                                            <div className="bg-[#fcfbf9] aspect-square w-24 rounded-[2rem] flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-purevit-primary group-hover:text-white transition-all">
                                                {React.cloneElement(item.icon, { size: 36 })}
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="text-3xl font-serif text-purevit-dark">{item.title}</h4>
                                                <p className="text-gray-500 text-xl leading-relaxed">{item.text}</p>
                                            </div>
                                        </div>
                                    );
                                    return null;
                                })}
                            </article>

                            {/* Author Footer */}
                            <footer className="mt-24 p-12 bg-white rounded-[3rem] border border-gray-100 flex flex-wrap items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-full border-4 border-[#fcfbf9] overflow-hidden">
                                        <img src="https://i.pravatar.cc/150?u=dr_smith" alt="Author" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-serif text-purevit-dark">Dr. Aris Thorne</h4>
                                        <p className="text-sm text-gray-400">Chief Science Officer, Purevit</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-6 py-3 rounded-xl border border-gray-100 flex items-center gap-2 text-purevit-dark hover:bg-purevit-dark hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest">
                                        <Share2 size={14} /> Share
                                    </button>
                                    <button className="px-6 py-3 rounded-xl border border-gray-100 flex items-center gap-2 text-purevit-dark hover:bg-purevit-dark hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest">
                                        <Bookmark size={14} /> Bookmark
                                    </button>
                                </div>
                            </footer>
                        </div>

                        {/* Sidebar Column */}
                        <aside className="lg:col-span-4 space-y-16">
                            {/* Featured Products - Elegant Cards */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 px-4">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purevit-primary/20"></div>
                                    <h5 className="font-serif text-xl text-purevit-dark italic">Featured Products</h5>
                                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purevit-primary/20"></div>
                                </div>

                                <div className="space-y-6">
                                    {article.relatedProducts?.map(product => (
                                        <Link
                                            key={product.id}
                                            to={`/products/${product.id}`}
                                            className="block bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
                                        >
                                            <div className="aspect-square overflow-hidden bg-[#fcfbf9]">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>
                                            <div className="p-6 space-y-3">
                                                <h6 className="font-serif text-xl text-purevit-dark group-hover:text-purevit-primary transition-colors leading-tight">
                                                    {product.name}
                                                </h6>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-2xl font-serif text-purevit-primary">${product.price}</span>
                                                    <div className="w-10 h-10 rounded-full bg-purevit-dark text-white flex items-center justify-center group-hover:bg-purevit-primary transition-colors">
                                                        <ArrowRight size={18} />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <Link
                                    to="/products"
                                    className="block w-full py-5 bg-gradient-to-r from-purevit-dark to-black text-white rounded-2xl text-center text-[10px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-purevit-primary/20 transition-all"
                                >
                                    Explore Full Collection
                                </Link>

                                {/* Newsletter - Refined */}
                                <div className="bg-gradient-to-br from-purevit-primary/5 to-transparent p-8 rounded-[2rem] border border-purevit-primary/10 space-y-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-purevit-primary/10 flex items-center justify-center shrink-0">
                                            <Mail size={18} className="text-purevit-primary" />
                                        </div>
                                        <div>
                                            <h6 className="font-serif text-lg text-purevit-dark mb-1">Science Weekly</h6>
                                            <p className="text-xs text-gray-500 leading-relaxed">Join 20,000+ readers for exclusive pharmaceutical insights.</p>
                                        </div>
                                    </div>
                                    <div className="flex h-12 rounded-xl overflow-hidden border border-gray-200 bg-white">
                                        <input
                                            type="email"
                                            placeholder="Your email"
                                            className="flex-1 px-4 text-sm focus:outline-none bg-transparent"
                                        />
                                        <button className="px-5 bg-purevit-primary hover:bg-purevit-dark text-white transition-colors">
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Related Reading */}
                            <div className="space-y-8 px-4">
                                <h5 className="font-serif text-2xl text-purevit-dark">Continue Reading</h5>
                                <div className="space-y-10">
                                    <Link to="/learn/pharmaceutical-standards" className="block group space-y-3">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purevit-primary">Purity</span>
                                        <h6 className="text-xl font-serif text-purevit-dark group-hover:underline leading-tight">Beyond FDA: Our 5-Step Integrity Standards.</h6>
                                    </Link>
                                    <Link to="/learn/personalized-wellness" className="block group space-y-3">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purevit-primary">Wellness</span>
                                        <h6 className="text-xl font-serif text-purevit-dark group-hover:underline leading-tight">Nutrigenomics and the Future of Custom Care.</h6>
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LearnArticlePage;
