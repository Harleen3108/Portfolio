import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import "../styles/navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Detect which section is currently in view
      const sections = [
        "hero",
        "about",
        "skills",
        "projects",
        "experience",
        "contact",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { to: "hero", label: "Home" },
    { to: "about", label: "About" },
    { to: "skills", label: "Skills" },
    { to: "projects", label: "Projects" },
    { to: "experience", label: "Experience" },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <h3 className="logo">
            <b>KAPIL</b> KHANDELWAL
          </h3>
          <ul className="nav-menu">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  smooth={true}
                  duration={500}
                  onClick={closeMobileMenu}
                  className={activeSection === item.to ? "active" : ""}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="contact" smooth={true} duration={500}>
            <button className="date-btn">CONTACT ME</button>
          </Link>
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? "active" : ""}`}>
        <button className="mobile-close-btn" onClick={closeMobileMenu}>
          ×
        </button>
        <ul className="mobile-nav-menu">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                smooth={true}
                duration={500}
                onClick={closeMobileMenu}
                className={activeSection === item.to ? "active" : ""}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="contact"
          smooth={true}
          duration={500}
          onClick={closeMobileMenu}
        >
          <button className="mobile-date-btn">CONTACT ME</button>
        </Link>
      </div>
    </>
  );
}

export default Navbar;
