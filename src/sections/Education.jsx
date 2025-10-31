import React from 'react';
import '../styles/education.css';

function Education() {
  const education = [
    {
      degree: 'Master of Computer Science',
      institution: 'Tech University',
      period: '2017 - 2019',
      description: 'Specialized in AI, Machine Learning, and Computer Graphics.'
    },
    {
      degree: 'Bachelor of Software Engineering',
      institution: 'State University',
      period: '2013 - 2017',
      description: 'Focus on web development, algorithms, and software architecture.'
    }
  ];

  return (
    <section id="education" className="education">
      <div className="education-container">
        <h3 className="section-label">KAPIL KHANDELWAL / LEARNING</h3>
        <h1 className="section-title">EDUCATION</h1>
        <div className="education-grid">
          {education.map((edu, index) => (
            <div key={index} className="education-card">
              <h2>{edu.degree}</h2>
              <h3>{edu.institution}</h3>
              <span className="period">{edu.period}</span>
              <p>{edu.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Education;