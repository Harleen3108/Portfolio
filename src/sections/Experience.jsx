import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import "../styles/experience.css";

function Experience() { // CHANGED: Renamed from EnhancedExperience to Experience
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const experiences = [
    {
      title: "Co-Founder",
      company: "Scrap Shera",
      period: "Jun 2023 - Present",
      description:
        "Helped grow Scrap Shera by creating customer-focused strategies, boosting engagement by 30% (estimated). Loved guiding my team to meet client expectations!",
    },
    {
      title: "Co-Founder",
      company: "Vorette Indica pvt ltd company",
      period: "Sep 2019 - Mar 2020",
      description:
        "The basic model and feature of startup was to provide food essentials and groceries to the households while not burning cash in conventional delivery model.",
    },
    {
      title: "Proprietor",
      company: "Avani Enterprises",
      period: "Nov 2021 - Present",
      description:
        "Managed Avani Enterprises with a focus on helping startups, growing client revenue by 25% (estimated) through consultation. Enjoyed experimenting with podcast ideas to boost brands!",
    },
    {
      title: "Sales Consultant",
      company: "Urban Company",
      period: "Apr 2021 - Nov 2021",
      description:
        "As per the opportunity provided by the Urban Company to be a duly registered service professional on the Urban Company platform and being a representative of the company directly with the customer base.",
    },
    {
      title: "Assistant Project Manager",
      company: "MRS Institute",
      period: "Jul 2017 - Aug 2019",
      description:
        "Coordinated teamwork efforts for brand strategy formulation and new business development, focusing on unified brand messaging and market opportunities.",
    },
  ];

  const TimelineCard = ({ exp, index }) => {
    const [cardRef, inView] = useInView({
      threshold: 0.3,
      triggerOnce: true,
    });

    const isLeft = index % 2 === 0;

    return (
      <motion.div 
        ref={cardRef}
        className="timeline-item"
        initial={{ 
          opacity: 0, 
          x: isLeft ? -100 : 100,
          scale: 0.8 
        }}
        animate={inView ? { 
          opacity: 1, 
          x: 0,
          scale: 1 
        } : {}}
        transition={{ 
          duration: 0.6,
          delay: index * 0.1,
          type: "spring",
          stiffness: 100
        }}
      >
        <motion.div 
          className="timeline-dot"
          initial={{ scale: 0 }}
          animate={inView ? { scale: [0, 1.5, 1] } : {}}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
        >
          <motion.div
            className="dot-pulse"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.1 + 0.8,
            }}
          />
        </motion.div>
        
        <motion.div 
          className="timeline-content"
          whileHover={{ 
            scale: 1.03,
            boxShadow: "0 20px 50px rgba(74, 144, 226, 0.3)",
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            className="timeline-glow"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          <h2>{exp.title}</h2>
          <h3>{exp.company}</h3>
          <span className="period">{exp.period}</span>
          <p>{exp.description}</p>
        </motion.div>
      </motion.div>
    );
  };

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="experience" ref={ref}>
      <div className="experience-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="section-label">KAPIL KHANDELWAL / JOURNEY</h3>
          <h1 className="section-title">PROFESSIONAL EXPERIENCE</h1>
        </motion.div>

        <div className="timeline">
          {/* Animated SVG Timeline Line */}
          <svg 
            className="timeline-svg"
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              height: "100%",
              width: "2px",
              transform: "translateX(-50%)",
              zIndex: 1,
            }}
          >
            <motion.line
              x1="1"
              y1="0"
              x2="1"
              y2="100%"
              stroke="url(#gradient)"
              strokeWidth="2"
              style={{
                pathLength: scrollYProgress,
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-secondary)" />
                <stop offset="100%" stopColor="var(--accent-primary)" />
              </linearGradient>
            </defs>
          </svg>

          {experiences.map((exp, index) => (
            <TimelineCard key={index} exp={exp} index={index} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .timeline {
          position: relative;
        }

        .timeline-svg {
          pointer-events: none;
        }

        .timeline-dot {
          position: relative;
        }

        .dot-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--accent-secondary);
          pointer-events: none;
        }

        .timeline-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, var(--accent-secondary), transparent);
          opacity: 0;
          border-radius: 12px;
          pointer-events: none;
          z-index: -1;
        }

        @media (max-width: 968px) {
          .timeline-svg {
            display: none;
          }
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
}

export default Experience; // CHANGED: Now exporting Experience