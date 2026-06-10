import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterPage = () => {
 const navigate = useNavigate();
 const [formData, setFormData] = useState({ name:'', email:'', password:''});
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);
 const { theme } = useTheme();

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError('');
 setLoading(true);
 
 try {
 await axios.post('/api/auth/register', formData);
 navigate('/login');
} catch (err) {
 setError(err.response?.data?.message ||'Failed to register');
} finally {
 setLoading(false);
}
};

 return (
 <div className={`min-h-screen w-full transition-colors duration-500 flex auth-grid-light dark:auth-grid-dark text-theme-text relative overflow-hidden`}>
 
 {/* Background Soft Glows */}
 <div className={`absolute top-0 left-0 w-[800px] h-[800px] rounded-full blur-[150px] mix-blend-multiply opacity-50 pointer-events-none transition-colors duration-500 bg-blue-100 dark:bg-[#A855F7]/20 dark:mix-blend-screen`} />

 <div className="max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row relative z-10 px-6 lg:px-12 py-12 min-h-screen">
 
 {/* LEFT COLUMN: MARKETING HERO */}
 <div className="flex-1 flex flex-col justify-center lg:pr-20 mb-16 lg:mb-0">
 
 {/* Logo Area */}
 <motion.div initial={{ opacity: 0, y: 20}} animate={{ opacity: 1, y: 0}} transition={{ duration: 0.5}} className="flex items-center gap-3 mb-8">
 <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-lg bg-blue-600 dark:bg-gradient-to-br dark:from-[#A855F7] dark:to-[#8B5CF6] dark:ai-glow-subtle`}>
 <Sparkles className="h-6 w-6 text-white"/>
 </div>
 <span className={`text-xl font-bold tracking-tight text-theme-text dark:text-white`}>IncidentIQ</span>
 </motion.div>

 <motion.div initial={{ opacity: 0, y: 20}} animate={{ opacity: 1, y: 0}} transition={{ duration: 0.5, delay: 0.1}}>
 <div className={`text-xs font-bold tracking-widest uppercase mb-6 text-blue-600 dark:text-[#8B5CF6]`}>
 AI INCIDENT INTELLIGENCE PLATFORM
 </div>

 <h1 className={`text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-8 text-theme-text dark:text-white`}>
 Detect incidents.<br/>
 Analyze root causes.<br/>
 <span className={`text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-[#A855F7] dark:to-[#8B5CF6]`}>
 Resolve faster.
 </span>
 </h1>

 <p className={`text-lg lg:text-xl max-w-xl leading-relaxed mb-16 text-theme-text-sec`}>
 IncidentIQ helps engineering teams investigate incidents using AI-powered timeline analysis, log intelligence, git change analysis, OCR extraction, and automated RCA generation.
 </p>
 </motion.div>

 {/* Floating Data Cards */}
 <motion.div initial={{ opacity: 0, y: 20}} animate={{ opacity: 1, y: 0}} transition={{ duration: 0.5, delay: 0.2}} className="flex flex-wrap gap-6 mt-auto lg:mt-0">
 <div className={`p-5 rounded-2xl shadow-lg border bg-theme-card border-theme-border w-48 transition-transform hover:-translate-y-1`}>
 <div className={`text-3xl font-black mb-1 text-theme-text dark:text-white`}>92%</div>
 <div className={`text-sm font-medium text-theme-text-sec`}>RCA Accuracy</div>
 </div>
 <div className={`p-5 rounded-2xl shadow-lg border bg-theme-card border-theme-border w-48 transition-transform hover:-translate-y-1`}>
 <div className={`text-3xl font-black mb-1 text-theme-text dark:text-white`}>3 min</div>
 <div className={`text-sm font-medium text-theme-text-sec`}>Average Investigation Time</div>
 </div>
 </motion.div>

 </div>

 {/* RIGHT COLUMN: AUTH CARD */}
 <div className="w-full lg:w-[500px] flex items-center justify-center">
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 20}} 
 animate={{ opacity: 1, scale: 1, y: 0}} 
 transition={{ duration: 0.6, type: "spring", bounce: 0.3}}
 className={`w-full rounded-[2rem] p-8 lg:p-10 shadow-2xl relative bg-theme-card backdrop-blur-xl border border-theme-border`}
 >
 <div className="mb-8">
 <h2 className={`text-3xl font-bold tracking-tight mb-2 text-theme-text dark:text-white`}>Create account</h2>
 <p className="text-theme-text-sec">Sign up to access your intelligence dashboard.</p>
 </div>

 {/* Segmented Control / Tabs */}
 <div className={`flex relative rounded-xl p-1 mb-8 bg-theme-bg`}>
 <div className="absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] translate-x-full bg-theme-card dark:bg-[#18181B] rounded-lg shadow-sm border border-theme-border dark:border-[#3F3F46] z-0 transition-transform duration-300 ease-in-out"/>
 <Link to="/login" className={`flex-1 relative z-10 py-2.5 text-sm font-medium text-center rounded-lg transition-colors text-theme-text-sec hover:text-theme-text`}>
 Sign in
 </Link>
 <button className={`flex-1 relative z-10 py-2.5 text-sm font-bold rounded-lg transition-colors text-theme-text dark:text-white`}>
 Register
 </button>
 </div>

 <form onSubmit={handleSubmit} className="space-y-4">
 {error && (
 <div className={`p-3 rounded-xl text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-100 dark:border-red-900/20`}>
 {error}
 </div>
 )}
 
 <input 
 required
 type="text"
 value={formData.name}
 onChange={(e) => setFormData({...formData, name: e.target.value})}
 className={`w-full rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all bg-theme-card border border-theme-border text-theme-text placeholder-slate-400 focus:ring-blue-600/20 dark:focus:ring-[#A855F7]/50 focus:border-blue-600 dark:focus:border-[#A855F7] shadow-sm`}
 placeholder="Enter your name"
 />
 <input 
 required
 type="email"
 value={formData.email}
 onChange={(e) => setFormData({...formData, email: e.target.value})}
 className={`w-full rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all bg-theme-card border border-theme-border text-theme-text placeholder-slate-400 focus:ring-blue-600/20 dark:focus:ring-[#A855F7]/50 focus:border-blue-600 dark:focus:border-[#A855F7] shadow-sm`}
 placeholder="Enter your email"
 />
 <input 
 required
 type="password"
 value={formData.password}
 onChange={(e) => setFormData({...formData, password: e.target.value})}
 className={`w-full rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all bg-theme-card border border-theme-border text-theme-text placeholder-slate-400 focus:ring-blue-600/20 dark:focus:ring-[#A855F7]/50 focus:border-blue-600 dark:focus:border-[#A855F7] shadow-sm`}
 placeholder="Password"
 />
 
 <button 
 type="submit"
 disabled={loading}
 className={`w-full mt-4 font-bold rounded-xl px-4 py-3.5 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed group text-white shadow-lg bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 dark:bg-gradient-to-r dark:from-[#A855F7] dark:to-[#8B5CF6] dark:hover:brightness-110 dark:shadow-[#A855F7]/25`}
 >
 {loading ?'Creating Account...' :'Create Account'}
 </button>

 <div className="relative my-8">
 <div className={`absolute inset-0 flex items-center`}>
 <div className={`w-full border-t border-theme-border`}></div>
 </div>
 <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
 <span className={`px-4 bg-theme-card text-theme-text-sec`}>OR</span>
 </div>
 </div>

 <button 
 type="button"
 className={`w-full font-bold rounded-xl px-4 py-3.5 flex items-center justify-center gap-3 transition-all bg-theme-card border border-theme-border text-theme-text hover:bg-theme-surface shadow-sm`}
 >
 <svg className="w-5 h-5"viewBox="0 0 24 24">
 <path fill="#4285F4"d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
 <path fill="#34A853"d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
 <path fill="#FBBC05"d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
 <path fill="#EA4335"d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
 </svg>
 Sign up with Google
 </button>
 </form>
 </motion.div>
 </div>

 </div>
 </div>
 );
};

export default RegisterPage;
