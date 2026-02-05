import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="bg-white min-h-screen text-black py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-serif font-bold mb-10 border-b pb-6">Privacy Policy</h1>

                <div className="space-y-8 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold mb-4">1. Data Collection</h2>
                        <p>We collect personal information that you provide to us directly when you create an account, make a purchase, or contact us. This may include your name, email address, shipping address, and payment information.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">2. Use of Information</h2>
                        <p>We use the collected information to process your orders, communicate with you about your account and our products, and improve our services. We do not sell your personal information to third parties.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">3. Data Security</h2>
                        <p>We implement a variety of security measures to maintain the safety of your personal information. Your payment information is encrypted and processed through secure payment gateways.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">4. Cookies</h2>
                        <p>Our website uses cookies to enhance your browsing experience and analyze site traffic. You can choose to disable cookies through your browser settings, though this may affect some functionality of the site.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">5. Third-Party Services</h2>
                        <p>We may use third-party service providers to help us operate our business and the website. These third parties have access to your information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">6. Your Rights</h2>
                        <p>You have the right to access, correct, or delete your personal information. If you wish to exercise any of these rights, please contact our privacy officer.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">7. Updates to This Policy</h2>
                        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
