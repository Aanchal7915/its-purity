import React from 'react';

const ShippingAndRefund = () => {
    return (
        <div className="bg-white min-h-screen text-black py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-serif font-bold mb-10 border-b pb-6">Shipping and Refund Policy</h1>

                <div className="space-y-8 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold mb-4">Shipping Policy</h2>
                        <div className="space-y-4">
                            <p>We strive to deliver products in excellent condition and as quickly as possible. Please review our shipping policy details below:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Processing Time:</strong> Orders are processed within 1-2 business days.</li>
                                <li><strong>Delivery Timeline:</strong> Domestic shipping typically takes 3-7 business days.</li>
                                <li><strong>Shipping Charges:</strong> Free shipping is available on orders above ₹499. For orders below this amount, a flat fee of ₹50 applies.</li>
                                <li><strong>Tracking:</strong> Once your order is shipped, you will receive a tracking number via email/SMS.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">Refund and Return Policy</h2>
                        <div className="space-y-4">
                            <p>At Its Purevit, we are committed to providing our customers with high-quality products. If you are not satisfied with your purchase, we are here to help.</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Return Window:</strong> You can request a return within 7 days of delivery.</li>
                                <li><strong>Eligibility:</strong> The product must be unused, in the same condition as received, and in its original packaging.</li>
                                <li><strong>Damaged Products:</strong> If you receive a damaged product, please contact us within 24 hours of delivery with images of the damage.</li>
                                <li><strong>Refund Process:</strong> Once we receive and inspect your return, we will notify you and process the refund to your original payment method within 7-10 working days.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">Cancellations</h2>
                        <p>Orders can be cancelled before they are processed by our warehouse. Once the order is shipped, it cannot be cancelled.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">Contact Us</h2>
                        <p>For any queries related to shipping or refunds, please reach out to us at support@purevit.in or call us at our customer support number.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ShippingAndRefund;
