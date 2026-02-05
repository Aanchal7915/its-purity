import React from 'react';

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-white text-black pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl md:text-5xl font-serif font-semibold">Terms & Conditions</h1>
                <p className="text-base leading-relaxed">
                    These Terms & Conditions govern your use of the Purevit website and services. By accessing
                    or using our site, you agree to be bound by these terms.
                </p>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold">Use of Website</h2>
                        <p className="mt-2 text-base leading-relaxed">
                            You agree to use this website for lawful purposes only and in a way that does not
                            infringe the rights of, restrict, or inhibit anyone else’s use and enjoyment.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold">Products & Information</h2>
                        <p className="mt-2 text-base leading-relaxed">
                            Product information is provided for general guidance. We do our best to keep
                            content accurate, but it may change without notice.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
                        <p className="mt-2 text-base leading-relaxed">
                            Purevit will not be liable for any damages arising from the use or inability to
                            use this site or products, to the fullest extent permitted by law.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold">Changes to Terms</h2>
                        <p className="mt-2 text-base leading-relaxed">
                            We may update these Terms & Conditions from time to time. Continued use of the
                            website indicates your acceptance of the updated terms.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
