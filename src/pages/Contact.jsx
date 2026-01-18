import React, { useState } from 'react';
import SEO from '../components/SEO';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const checkCussWords = (text) => {
        const cussWords = ['badword1', 'badword2', 'badword3'];
        const pattern = new RegExp(cussWords.join('|'), 'gi');
        return pattern.test(text);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Basic validation
        if (checkCussWords(formData.message) || checkCussWords(formData.name)) {
            alert("Please keep the language clean.");
            setIsSubmitting(false);
            return;
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log('Form submitted:', formData);
        setSubmitted(true);
        setIsSubmitting(false);
    };

    if (submitted) {
        return (
            <div className="p-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Message Sent!</h2>
                <p className="text-slate-400 mb-8">
                    Thanks for reaching out. We'll get back to you as soon as possible.
                </p>
                <button
                    onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', message: '' });
                    }}
                    className="btn-primary"
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <SEO
                title="Contact Us"
                description="Get in touch with the DB Playground team for queries, suggestions, or support."
            />
            <h1 className="text-3xl font-bold mb-2 text-white">Contact Us</h1>
            <p className="text-slate-400 mb-8">
                Have questions or suggestions? We'd love to hear from you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                        placeholder="Your name"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        required
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                        placeholder="How can we help you?"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                        </>
                    ) : (
                        'Send Message'
                    )}
                </button>
            </form>
        </div>
    );
};

export default Contact;
