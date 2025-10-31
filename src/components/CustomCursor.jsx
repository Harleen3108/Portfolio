import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView as useInViewHook } from 'react-intersection-observer';

// ========== CUSTOM CURSOR ==========
const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', moveCursor);

    const interactiveElements = document.querySelectorAll('a, button, .professional-card, .skill-card, .project-card, .achievement-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [cursorX, cursorY]);

  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  return (
    <>
      <motion.div
        className="custom-cursor"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isVisible ? 0.6 : 0,
        }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="custom-cursor-dot"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
        animate={{
          scale: isHovering ? 0 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />
      <style jsx>{`
        .custom-cursor {
          position: fixed;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(74, 144, 226, 0.4), transparent);
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: screen;
        }
        .custom-cursor-dot {
          position: fixed;
          width: 8px;
          height: 8px;
          margin-left: 12px;
          margin-top: 12px;
          border-radius: 50%;
          background: var(--accent-secondary);
          pointer-events: none;
          z-index: 9999;
        }
      `}</style>
    </>
  );
};

// ========== ENHANCED ABOUT WITH ANIMATED STATS ==========
const EnhancedAbout = () => {
  const [ref, inView] = useInViewHook({
    threshold: 0.3,
    triggerOnce: true,
  });

  const achievements = [
    { number: 7, suffix: "L+", label: "Business Consultations", icon: "💼" },
    { number: 40, suffix: "%", label: "Engagement Boost", icon: "📈" },
    { number: 25, suffix: "%", label: "Revenue Growth", icon: "💰" },
    { number: 6, suffix: "+", label: "Years Experience", icon: "⭐" },
  ];

  const experiences = [
    {
      icon: "🏢",
      title: "Avani Enterprises",
      description: "3+ years of business consulting and startup guidance",
    },
    {
      icon: "♻️",
      title: "Scrap Shera",
      description: "Strategic role in business development and operations",
    },
    {
      icon: "🚀",
      title: "Startup Consulting",
      description: "Working with diverse startups since 2017",
    },
  ];

  const cardVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: (i) => ({
      scale: 1,
      rotate: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 12,
      }
    })
  };

  return (
    <section id="about" className="about">
      <div className="about-wrapper">
        <motion.div 
          className="about-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="section-label">ABOUT / KP KHANDELWAL</h3>
          <h1 className="section-title">Startup Growth Consultant</h1>
          <p className="about-intro">
            Hi, I'm KP Khandelwal! I help startups and business leaders grow
            through podcast promotion and strategic consultation. With extensive
            experience at Avani Enterprises and Scrap Shera, I've mastered what
            truly works for entrepreneurs.
          </p>
        </motion.div>

        <div className="achievement-stats" ref={ref}>
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              className="achievement-card"
              custom={index}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 50px rgba(74, 144, 226, 0.3)"
              }}
            >
              <motion.div
                className="achievement-icon-large"
                initial={{ scale: 0 }}
                animate={inView ? { scale: [0, 1.2, 1] } : { scale: 0 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
              >
                {achievement.icon}
              </motion.div>
              
              <motion.div className="achievement-number-wrapper">
                {inView && (
                  <CountUp
                    end={achievement.number}
                    duration={2}
                    delay={index * 0.1}
                    suffix={achievement.suffix}
                    className="achievement-number"
                  />
                )}
              </motion.div>

              <span className="achievement-label">{achievement.label}</span>

              {/* Progress ring */}
              <svg className="progress-ring" width="120" height="120">
                <motion.circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="var(--accent-primary)"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ 
                    delay: index * 0.1 + 0.5, 
                    duration: 1.5,
                    ease: "easeInOut" 
                  }}
                  style={{
                    strokeDasharray: "0 1",
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%"
                  }}
                />
              </svg>

              {/* Glow pulse effect */}
              <motion.div
                className="achievement-glow"
                animate={inView ? {
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                } : {}}
                transition={{
                  delay: index * 0.1 + 1,
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            </motion.div>
          ))}
        </div>

        <div className="about-content">
          <div className="content-left">
            <h2>My Journey</h2>
            <div className="experience-highlights">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  className="experience-item"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  whileHover={{ x: 10 }}
                >
                  <div className="experience-icon">{exp.icon}</div>
                  <div className="experience-content">
                    <h4>{exp.title}</h4>
                    <p>{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="content-right">
            <motion.div 
              className="highlight-box"
              initial={{ opacity: 0, rotateY: -20 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 15px 40px rgba(74, 144, 226, 0.2)"
              }}
            >
              <h3>Author: "The Startup Summary"</h3>
              <p>
                Sharing knowledge and insights to support small businesses and
                entrepreneurs in their growth journey. Passionate about
                empowering founders with practical strategies.
              </p>
            </motion.div>

            <motion.div 
              className="highlight-box"
              initial={{ opacity: 0, rotateY: 20 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 15px 40px rgba(74, 144, 226, 0.2)"
              }}
            >
              <h3>Proven Results</h3>
              <p>
                Created podcasts that boosted engagement by 40% for startup
                clients through strategic content and audience targeting.
                Delivered consultation that increased client revenue by 25% with
                simple, actionable strategies.
              </p>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="cta-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="cta-text">
            Passionate about founder branding and digital marketing to tell your
            unique story.
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        .achievement-card {
          position: relative;
          overflow: visible !important;
        }

        .achievement-icon-large {
          font-size: 2.5rem;
          margin-bottom: 15px;
        }

        .progress-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          opacity: 0.3;
        }

        .achievement-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, var(--accent-secondary), transparent);
          border-radius: 12px;
          pointer-events: none;
          z-index: -1;
        }

        .achievement-number-wrapper {
          position: relative;
          z-index: 2;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export { CustomCursor, EnhancedAbout };