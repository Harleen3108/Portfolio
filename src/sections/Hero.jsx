import React from "react";
import ThreeDModel from "../components/ThreeDModel";
import "../styles/hero.css";

function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-background-elements">
        <div className="background-grid"></div>
        <div className="floating-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
      </div>

      <div className="hero-content">
        <div className="animated-text">
          <h1>
            <b>KAPIL</b> KHANDELWAL
          </h1>
          <h1>
            <b>KAPIL</b> KHANDELWAL
          </h1>
          <h1>
            <b>KAPIL</b> KHANDELWAL
          </h1>
        </div>
        {/* <h3 className="hero-subtitle">
          KAPIL KHANDELWAL AIMS TO BE A DECENTRALIZED COMMUNITY THAT CAN
          <br />
          CREATE NEW VALUES AND PROFITS THROUGH PLAY IN THE VIRTUAL
          <br />
          WORLD.
        </h3> */}

        {/* <div className="hero-actions">
          <button className="cta-btn">VIEW PORTFOLIO</button>
          <button className="cta-btn cta-btn-secondary">GET IN TOUCH</button>
        </div> */}

        {/* <div className="scroll-indicator">SCROLL TO EXPLORE</div> */}
      </div>
      <ThreeDModel />
    </section>
  );
}

export default Hero;
