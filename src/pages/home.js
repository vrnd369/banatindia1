import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../pages/home.css'; 
//import RotatingText from '../components/rotate.js';
import pic1 from '../assets/pic1.jpg';
import pic2 from '../assets/pic2.jpg';
import pic3 from '../assets/pic3.avif';
//import Cart from '../components/Cart.js'; // Assuming you have a Cart component
import Carousel1 from './category.js';
import About from './about.js';
import Contact from './contact.js';

const Home = () => {
  return (
    <>
      <div className="carousel-flex-row">
        <div className="big-carousel-container">
          <Carousel
            className="big-carousel"
            showThumbs={false}
            autoPlay
            infiniteLoop
            showStatus={false}
            interval={3000}
            transitionTime={800}
          >
          <div className="carousel-slide-with-logo">
            <img src={pic1} alt="Slide 1" />
          </div>
          <div className="carousel-slide-with-logo">
            <img src={pic2} alt="Slide 2" />
          </div>
          <div className="carousel-slide-with-logo">
          <img src={pic3} alt="Slide 3" />
        </div>
      </Carousel>
    </div>
      </div>
      <About/>
      <Carousel1/>
      <Contact/>
    </>
  );
};

export default Home;