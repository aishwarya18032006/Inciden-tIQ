import React from'react';
import { useTheme} from'../context/ThemeContext';
import { Sun, Moon} from'lucide-react';
import { motion, AnimatePresence} from'framer-motion';

const ThemeToggle = () => {
 const { theme, toggleTheme} = useTheme();

 return (
 <div className="fixed top-6 right-6 z-[60] flex items-center justify-center">
 <motion.button
 whileHover={{ scale: 1.08}}
 whileTap={{ scale: 0.95}}
 onClick={toggleTheme}
 className="relative w-12 h-12 rounded-full flex items-center justify-center bg-theme-card backdrop-blur-xl border border-theme-border shadow-[0_8px_32px_rgba(37,99,235,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-colors overflow-hidden group"
 aria-label="Toggle Dark Mode"
 >
 <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-slate-700/50 dark:to-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
 
 <AnimatePresence mode="wait"initial={false}>
 {theme ==='light' ? (
 <motion.div
 key="sun"
 initial={{ y: -20, opacity: 0, rotate: -90}}
 animate={{ y: 0, opacity: 1, rotate: 0}}
 exit={{ y: 20, opacity: 0, rotate: 90}}
 transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20}}
 className="relative z-10"
 >
 <Moon className="h-5 w-5 text-theme-text-sec drop-shadow-sm"/>
 </motion.div>
 ) : (
 <motion.div
 key="moon"
 initial={{ y: -20, opacity: 0, rotate: -90}}
 animate={{ y: 0, opacity: 1, rotate: 0}}
 exit={{ y: 20, opacity: 0, rotate: 90}}
 transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20}}
 className="relative z-10"
 >
 <Sun className="h-5 w-5 text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.8)]"/>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.button>
 </div>
 );
};

export default ThemeToggle;
