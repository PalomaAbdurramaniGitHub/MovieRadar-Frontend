import React from "react";
import './About.css';

const About = () => {
  return (
    <div className="container about-page my-5">
      <section className="about-hero">
        <h1>About Us</h1>
        <p>
          Welcome to MovieRadar, where movie enthusiasts come together to discover, discuss, and dive deep into the world of cinema. Our mission is to connect people through the love of movies and provide a space where everyone's voice is heard.
        </p>
      </section>

      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          At MovieRadar, we believe that movies have the power to inspire, educate, and entertain. Our goal is to create a platform that not only suggests the best movies for you but also fosters a community where you can share your thoughts, provide feedback, and influence the future of our platform.
        </p>
      </section>

      <section className="about-team">
        <h2>Meet the Team</h2>
        <p>
          Our team is a group of passionate movie lovers, tech enthusiasts, and creative thinkers. We are dedicated to constantly improving your experience, curating the best movie suggestions, and ensuring that your voice shapes our platform.
        </p>
      </section>

      <section className="about-values">
        <h2>What We Value</h2>
        <ul>
          <li>🌟 Community - We are building a platform driven by its users.</li>
          <li>🎬 Diversity - We celebrate movies from all genres, languages, and cultures.</li>
          <li>🚀 Innovation - We're always evolving, incorporating your feedback and the latest technology.</li>
        </ul>
      </section>

      <section className="about-cta">
        <h2>Get Involved</h2>
        <p>
          We're not just a platform; we're a community. Whether you're here to find your next favorite movie, share your thoughts, or help us improve, we welcome you. Join us on this cinematic journey, and let's make something amazing together!
        </p>
      </section>
    </div>
  );
};

export default About;