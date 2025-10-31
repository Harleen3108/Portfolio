import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('dark');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    if (newTheme === 'light') {
      root.style.setProperty('--bg-primary', '#f8fafc');
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--text-primary', '#1e293b');
      root.style.setProperty('--text-secondary', '#475569');
      root.style.setProperty('--text-tertiary', '#64748b');
      root.style.setProperty('--border-light', 'rgba(74, 144, 226, 0.2)');
      
      // Update navbar background for light mode
      const navbar = document.querySelector('.navbar.scrolled');
      if (navbar) {
        navbar.style.background = 'rgba(248, 250, 252, 0.95)';
      }
    } else {
      root.style.setProperty('--bg-primary', '#0f1419');
      root.style.setProperty('--bg-secondary', '#1a222d');
      root.style.setProperty('--text-primary', '#e2e8f0');
      root.style.setProperty('--text-secondary', '#a0aec0');
      root.style.setProperty('--text-tertiary', '#718096');
      root.style.setProperty('--border-light', 'rgba(74, 144, 226, 0.1)');
      
      // Update navbar background for dark mode
      const navbar = document.querySelector('.navbar.scrolled');
      if (navbar) {
        navbar.style.background = 'rgba(15, 20, 25, 0.95)';
      }
    }
  };

  const toggleTheme = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'theme-ripple';
    ripple.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: ${newTheme === 'light' ? '#f8fafc' : '#0f1419'};
      transform: translate(-50%, -50%);
      animation: ripple-expand 1s ease-out forwards;
      z-index: 9998;
      pointer-events: none;
      mix-blend-mode: normal;
    `;
    document.body.appendChild(ripple);
    
    setTimeout(() => {
      setTheme(newTheme);
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      
      setTimeout(() => {
        ripple.remove();
        setIsAnimating(false);
      }, 1000);
    }, 500);
  };

  return (
    <>
      <motion.button
        className="theme-toggle-button"
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: isAnimating ? 360 : 0,
        }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--gradient-primary)',
          border: '2px solid var(--accent-tertiary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          boxShadow: '0 8px 25px rgba(74, 144, 226, 0.3)',
          overflow: 'visible',
        }}
      >
        <AnimatePresence mode="wait">
          {theme === 'dark' ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                fontSize: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              🌙
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                fontSize: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              ☀️
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orbital particles */}
        <motion.div
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: 'white',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
            top: '-3px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: 'white',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
            bottom: '-3px',
            right: '50%',
            transform: 'translateX(50%)',
          }}
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.button>

      <style jsx>{`
        @keyframes ripple-expand {
          0% {
            width: 0;
            height: 0;
            opacity: 0.8;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            width: 300vw;
            height: 300vw;
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .theme-toggle-button {
            width: 50px !important;
            height: 50px !important;
            bottom: 20px !important;
            right: 20px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .theme-toggle-button,
          .theme-ripple {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default ThemeToggle;