import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "../styles/projects.css";

function Projects() {
  const [flippedCard, setFlippedCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const projects = [
    {
      title: "The Rohtak Shoe Company",
      description:
        "A growing footwear brand founded with a vision to deliver comfort, style, and durability in every step. What started as a small local initiative has evolved into a trusted name known for crafting high-quality shoes using premium materials and innovative designs.",
      video: "/videos/project1.mp4",
      stats: {
        products: "500+",
        customers: "5K+",
        rating: "4.9/5",
      },
    },
    {
      title: "Holy Heart",
      description:
        "Built on the belief that every heartbeat matters, the center combines modern medical technology with expert cardiologists to deliver world-class patient care.",
      video: "/videos/project2.mp4",
      stats: {
        patients: "1000+",
        services: "15+",
        satisfaction: "98%",
      },
    },
    {
      title: "SSJ – Electronics & Home Décor Gifts",
      description:
        "The website brings together functionality and aesthetics, featuring a wide range of products from the latest gadgets to elegant decorative pieces that elevate any living space.",
      video: "/videos/project3.mp4",
      stats: {
        brands: "75+",
        engagement: "+60%",
        reach: "10K+",
      },
    },
  ];

  const ProjectCard = ({ project, index }) => {
    const [cardRef, cardInView] = useInView({
      threshold: 0.3,
      triggerOnce: true,
    });

    const isFlipped = flippedCard === index;

    const handleCardClick = () => {
      // Only flip the clicked card
      setFlippedCard(isFlipped ? null : index);
    };

    return (
      <motion.div
        ref={cardRef}
        className={`project-card-3d ${isFlipped ? "flipped" : ""}`}
        initial={{ opacity: 0, y: isMobile ? 50 : 100 }}
        animate={
          cardInView
            ? {
                opacity: 1,
                y: 0,
              }
            : {}
        }
        transition={{
          delay: index * 0.15,
          duration: 0.6,
          type: "spring",
          stiffness: 100,
        }}
      >
        <div className="project-card-inner" onClick={handleCardClick}>
          {/* Front of card - ALWAYS VISIBLE unless flipped */}
          <motion.div
            className="project-card-face project-card-front"
            initial={false}
            animate={{
              opacity: isFlipped ? 0 : 1,
              rotateY: isFlipped ? 90 : 0,
              scale: isFlipped ? 0.9 : 1,
            }}
            transition={{ duration: 0.4, type: "spring" }}
            style={{
              position: isFlipped ? "absolute" : "relative",
              zIndex: isFlipped ? 1 : 2,
            }}
          >
            <div className="project-header">
              <h2>{project.title}</h2>
            </div>

            <div className="video-container">
              <video
                className="project-video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src={project.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {!isMobile && (
                <motion.div
                  className="flip-hint"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  Click to flip →
                </motion.div>
              )}

              {isMobile && (
                <div className="mobile-flip-hint">Tap for details</div>
              )}
            </div>

            <div className="project-footer">
              <p className="project-description">{project.description}</p>
            </div>
          </motion.div>

          {/* Back of card - ONLY VISIBLE when flipped */}
          <motion.div
            className="project-card-face project-card-back"
            initial={false}
            animate={{
              opacity: isFlipped ? 1 : 0,
              rotateY: isFlipped ? 0 : -90,
              scale: isFlipped ? 1 : 0.9,
            }}
            transition={{ duration: 0.4, type: "spring" }}
            style={{
              position: isFlipped ? "relative" : "absolute",
              zIndex: isFlipped ? 2 : 1,
            }}
          >
            <div className="stats-container">
              <h3>Project Impact</h3>

              <div className="stats-grid">
                {Object.entries(project.stats).map(([key, value], i) => (
                  <motion.div
                    key={key}
                    className="stat-item"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={
                      isFlipped
                        ? {
                            scale: 1,
                            opacity: 1,
                          }
                        : {}
                    }
                    transition={{
                      delay: 0.2 + i * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    <div className="stat-value">{value}</div>
                    <div className="stat-label">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="back-button"
                whileHover={{ scale: !isMobile ? 1.05 : 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setFlippedCard(null);
                }}
              >
                ← Back to Project
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="projects" className="projects">
      <div className="projects-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="section-label">KAPIL KHANDELWAL / PROJECTS</h3>
          <h1 className="section-title">FEATURED WORK</h1>
        </motion.div>

        <div className="projects-grid" ref={ref}>
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
