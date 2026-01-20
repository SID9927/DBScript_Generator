import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Container = ({ children, isModal }) => {
    if (isModal) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                {children}
            </div>
        );
    }
    return (
        <div className="flex items-center justify-center min-h-[85vh] p-4">
            {children}
        </div>
    );
};

const Login = ({ isModal = false, onClose }) => {
    const { loginWithGoogle, loginWithEmail, signup } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSuccess = () => {
        if (isModal && onClose) {
            onClose();
        } else {
            navigate('/clipboard');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
            handleSuccess();
        } catch (err) {
            setError('Failed to log in with Google: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            if (isSignup) {
                await signup(email, password);
            } else {
                await loginWithEmail(email, password);
            }
            handleSuccess();
        } catch (err) {
            // Firebase auth errors are often ugly codes, let's clean them up a bit
            let msg = err.message;
            if (msg.includes("auth/invalid-email")) msg = "Invalid email address.";
            if (msg.includes("auth/user-not-found")) msg = "No account found with this email.";
            if (msg.includes("auth/wrong-password")) msg = "Incorrect password.";
            if (msg.includes("auth/email-already-in-use")) msg = "Email already in use.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container isModal={isModal}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden flex flex-col md:flex-row"
            >
                {isModal && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-red-500/20 transition-all border border-slate-700/50"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                {/* Decorative Gradients */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

                {/* Left Side: Branding / Welcome */}
                <div className="md:w-5/12 bg-gradient-to-br from-slate-900/80 to-slate-800/80 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden border-r border-slate-700/50">
                    <div className="absolute inset-0 bg-grid-slate-700/[0.1] bg-[length:20px_20px]"></div>
                    <div className="relative z-10">
                        <img
                            src="/logoDB.png"
                            alt="DB Playground"
                            className="w-32 h-auto mx-auto mb-6 drop-shadow-2xl"
                        />
                        <h2 className="text-2xl font-bold text-white mb-2">Cloud Clipboard</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Sync your snippets seamlessly across your storage devices and environments.
                        </p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-7/12 p-8 md:p-10">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white">
                            {isSignup ? 'Create Account' : 'Welcome'}
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl flex items-start gap-3"
                        >
                            <svg className="w-5 h-5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-white placeholder-slate-600 transition-all font-medium"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-white placeholder-slate-600 transition-all font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-2 font-bold text-slate-900 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-slate-900" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                isSignup ? 'Create Account' : 'Sign In'
                            )}
                        </motion.button>
                    </form>

                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px bg-slate-700/50 flex-1"></div>
                        <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">Or continue with</span>
                        <div className="h-px bg-slate-700/50 flex-1"></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full py-2.5 flex items-center justify-center gap-3 font-medium bg-white text-slate-800 rounded-xl hover:bg-slate-50 hover:shadow-lg transition-all border border-slate-200"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Google
                    </button>

                    <p className="mt-6 text-center text-sm text-slate-400">
                        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            onClick={() => setIsSignup(!isSignup)}
                            className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline focus:outline-none transition-colors"
                        >
                            {isSignup ? 'Sign In' : 'Create Account'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </Container>
    );
};

export default Login;
