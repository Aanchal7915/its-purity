import React from 'react';
import { Link } from 'react-router-dom';

const Sitemap = () => {
    const siteLinks = [
        {
            title: "Main Pages",
            links: [
                { name: "Home", path: "/" },
                { name: "Shop Products", path: "/products" },
                { name: "About Us", path: "/about" },
                { name: "Contact Us", path: "/contact" },
                { name: "Customized Solution", path: "/customized-solution" },
            ]
        },
        {
            title: "User Account",
            links: [
                { name: "Login", path: "/login" },
                { name: "Register", path: "/register" },
                { name: "My Account", path: "/dashboard" },
                { name: "My Cart", path: "/cart" },
                { name: "My Wishlist", path: "/wishlist" },
            ]
        },
        {
            title: "Legal & Support",
            links: [
                { name: "Terms and Conditions", path: "/terms-and-conditions" },
                { name: "Shipping and Refund Policy", path: "/shipping-and-refund" },
                { name: "Privacy Policy", path: "/privacy-policy" },
                { name: "Sitemap", path: "/sitemap" },
            ]
        }
    ];

    return (
        <div className="bg-white min-h-screen text-black py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-serif font-bold mb-10 border-b pb-6">Its Purevit Site Map</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {siteLinks.map((section, idx) => (
                        <div key={idx} className="space-y-6">
                            <h2 className="text-xl font-bold border-l-4 border-purevit-primary pl-4">{section.title}</h2>
                            <ul className="space-y-3">
                                {section.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <Link to={link.path} className="text-gray-600 hover:text-purevit-primary transition-colors text-sm font-medium">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sitemap;
