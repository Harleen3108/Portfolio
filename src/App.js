import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CustomCursor } from './components/CustomCursor'; // CHANGED: Named import
import ThemeToggle from './components/ThemeToggle';

import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
// import Education from './sections/Education';
import Contact from './sections/Contact';
import './styles/global.css';

function App() {
  return (
    <div className="App">
      <CustomCursor />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      {/* <Education /> */}
      <Contact />
      <Footer />
      <ThemeToggle />
    </div>
  );
}

export default App;
