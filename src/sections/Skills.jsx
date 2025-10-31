import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import "../styles/skills.css";

function Skills() { // CHANGED: Renamed from EnhancedSkills to Skills
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const businessSkills = [
    {
      title: "Business Consulting",
      description:
        "Strategic business advice and comprehensive growth planning to drive sustainable success.",
      connections: [1, 4, 5],
    },
    {
      title: "Startup Marketing",
      description:
        "Targeted marketing strategies and brand positioning for startup growth and market penetration.",
      connections: [0, 2, 3],
    },
    {
      title: "Founder Branding",
      description:
        "Personal branding development for business leaders to enhance credibility and influence.",
      connections: [1, 3, 5],
    },
    {
      title: "Digital Marketing",
      description:
        "Modern digital marketing campaigns to maximize online presence and customer engagement.",
      connections: [1, 2, 4],
    },
    {
      title: "Project Management",
      description:
        "Efficient project planning, execution, and team leadership for successful delivery.",
      connections: [0, 3, 5],
    },
    {
      title: "Business Strategy",
      description:
        "Comprehensive strategic planning and business development for long-term growth.",
      connections: [0, 2, 4],
    },
  ];

  // Calculate connection lines between cards
  const getConnectionLine = (fromIndex, toIndex) => {
    const positions = [
      { x: 16.6, y: 25 },
      { x: 50, y: 25 },
      { x: 83.3, y: 25 },
      { x: 16.6, y: 75 },
      { x: 50, y: 75 },
      { x: 83.3, y: 75 },
    ];

    return {
      x1: `${positions[fromIndex].x}%`,
      y1: `${positions[fromIndex].y}%`,
      x2: `${positions[toIndex].x}%`,
      y2: `${positions[toIndex].y}%`,
    };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      }
    }
  };

  return (
    <section id="skills" className="skills">
      <div className="skills-container">
        <motion.div 
          className="skills-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="section-label">KAPIL KHANDELWAL / EXPERTISE</h3>
          <h1 className="section-title">BUSINESS EXPERTISE</h1>
          <p className="skills-description">
            With over a decade of experience in business transformation and
            startup consulting, I bring strategic insights and practical
            solutions to drive your business forward.
          </p>
        </motion.div>

        <div className="skills-grid-wrapper" ref={ref}>
          {/* SVG Connection Lines */}
          <svg className="connection-lines">
            {businessSkills.map((skill, fromIndex) =>
              skill.connections.map((toIndex) => {
                const line = getConnectionLine(fromIndex, toIndex);
                const isActive = hoveredIndex === fromIndex || hoveredIndex === toIndex;
                
                return (
                  <motion.line
                    key={`${fromIndex}-${toIndex}`}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="var(--accent-primary)"
                    strokeWidth="1"
                    opacity={isActive ? 0.8 : 0.1}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView ? { 
                      pathLength: 1, 
                      opacity: isActive ? 0.8 : 0.1 
                    } : {}}
                    transition={{ 
                      duration: 1.5,
                      delay: fromIndex * 0.1,
                      opacity: { duration: 0.3 }
                    }}
                  />
                );
              })
            )}
          </svg>

          <motion.div 
            className="skills-grid"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {businessSkills.map((skill, index) => {
              const isHovered = hoveredIndex === index;
              const isConnected = hoveredIndex !== null && 
                businessSkills[hoveredIndex]?.connections.includes(index);

              return (
                <motion.div
                  key={index}
                  className="skill-card"
                  variants={cardVariants}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  animate={{
                    scale: isHovered ? 1.08 : isConnected ? 1.03 : 1,
                    zIndex: isHovered ? 10 : isConnected ? 5 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Ripple effect on hover */}
                  {isHovered && (
                    <motion.div
                      className="ripple-effect"
                      initial={{ scale: 0, opacity: 0.6 }}
                      animate={{ 
                        scale: [0, 2.5],
                        opacity: [0.6, 0],
                      }}
                      transition={{ 
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 0.5,
                      }}
                    />
                  )}

                  {/* Card glow */}
                  <motion.div
                    className="card-glow"
                    animate={{
                      opacity: isHovered ? 0.8 : isConnected ? 0.4 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  <h3>{skill.title}</h3>
                  <p>{skill.description}</p>

                  {/* Tooltip on hover */}
                  <motion.div
                    className="skill-tooltip"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: isHovered ? 1 : 0,
                      y: isHovered ? 0 : 10,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <strong>Connected Skills:</strong>
                    <div className="connected-skills">
                      {skill.connections.map((connIndex) => (
                        <span key={connIndex} className="connected-skill-tag">
                          {businessSkills[connIndex].title.split(' ')[0]}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .skills-grid-wrapper {
          position: relative;
          margin-top: 60px;
        }

        .connection-lines {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          position: relative;
          z-index: 1;
        }

        .skill-card {
          position: relative;
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          padding: 30px;
          cursor: pointer;
          overflow: visible;
        }

        .ripple-effect {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, var(--accent-secondary), transparent);
          border-radius: 50%;
          pointer-events: none;
        }

        .card-glow {
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          background: radial-gradient(circle at center, var(--accent-secondary), transparent);
          border-radius: 12px;
          pointer-events: none;
          z-index: -1;
          filter: blur(15px);
        }

        .skill-tooltip {
          position: absolute;
          bottom: -70px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--bg-primary);
          border: 1px solid var(--accent-primary);
          border-radius: 8px;
          padding: 12px 16px;
          white-space: nowrap;
          font-size: 12px;
          z-index: 100;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .skill-tooltip::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 6px solid var(--accent-primary);
        }

        .connected-skills {
          display: flex;
          gap: 6px;
          margin-top: 6px;
        }

        .connected-skill-tag {
          background: var(--accent-primary);
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .skills-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .connection-lines {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .skills-grid {
            grid-template-columns: 1fr;
          }
          .skill-tooltip {
            white-space: normal;
            width: 80%;
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

export default Skills; // CHANGED: Now exporting Skills