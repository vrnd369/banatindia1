import React from 'react';
import './rotate.css';
import logo from '../assets/b.png'; // your "b" logo
import star from '../assets/star.png'; // optional star

const RotatingText = () => {
  const text = "Shine with banat ";
  return (
    <div className="circle-container">
      <div className="rotating-text-circle">
        {[...text].map((char, i) => (
          
<span
  key={i}
  style={{
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: `
      rotate(${i * (360 / text.length)}deg)
      translate(0, -140px)
      rotate(-${i * (360 / text.length)}deg)
    `
  }}
>
  {char}
</span>

        ))}
      </div>
      <img src={logo} alt="Banat logo" className="center-logo" />
      <img src={star} alt="star" className="star-icon" />
    </div>
  );
};

export default RotatingText;
