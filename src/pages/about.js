// src/pages/About.js
import React from 'react';
import './about.css';
import aboutImage from '../assets/pic1.jpg'; // Add your image here

const About = () => {
  return (
    <section className="about-section">
      <div className="about-content">
        <h2>About Us</h2>
        <p>
          At <strong>Banat</strong>, we specialize in premium-quality toothbrushes designed for all age groups.
          From ultra-soft bristles for children to ergonomic handles for seniors,
          our product line combines innovation, hygiene, and comfort. Trusted by families worldwide,
          we are committed to delivering dental care tools that promote healthy, confident smiles.
        </p>
        <p>
          Our mission is to make daily brushing more effective, enjoyable, and accessible through
          modern design and medically approved materials. Join thousands who trust Banat for better oral hygiene.
        </p>
      </div>
      <div className="about-image-wrapper">
        <img src={aboutImage} alt="Toothbrush Products" className="about-image" />
      </div>
    </section>
  );
};

export default About;
