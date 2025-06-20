import React from 'react';
import './loader.css'; 

const Loader = () => {
  const text = 'banat';

  return (
    <div className="loader-container">
      <div className="loader-text">
        {text.split('').map((char, i) => (
          <span
            key={i}
            className="loader-letter"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Loader;
