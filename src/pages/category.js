import './category.css';
import React, { useState } from 'react';
import { Star, Baby, User, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaCheck, FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const Category = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const categories = [
    {
      id: 'children',
      icon: Baby,
      title: "Children's Collection",
      subtitle: "Gentle Care for Growing Smiles",
      description: "Specially designed toothbrushes with soft bristles and fun colors to make brushing enjoyable for kids aged 3-12.",
      gradient: "from-pink-500 via-purple-500 to-indigo-500",
      bgGradient: "from-pink-50/80 via-purple-50/60 to-indigo-50/80",
      iconColor: "text-pink-500",
      features: ["Soft Bristles", "Fun Colors", "Ergonomic Handle"],
      price: "From ₹85"
    },
    {
      id: 'adult',
      icon: User,
      title: "Adult Premium Series",
      subtitle: "Advanced Cleaning Technology",
      description: "Professional-grade toothbrushes with precision-engineered bristles for comprehensive oral care and plaque removal.",
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      bgGradient: "from-blue-50/80 via-cyan-50/60 to-teal-50/80",
      iconColor: "text-blue-500",
      features: ["Multi-Level Bristles", "Whitening Action", "Gum Protection"],
      price: "From ₹120"
    },
    {
      id: 'old age',
      icon: Shield,
      title: "Essential Care Line",
      subtitle: "Sensitive Teeth Solutions",
      description: "Ultra-gentle toothbrushes designed for sensitive teeth and gums, providing effective cleaning without irritation.",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      bgGradient: "from-green-50/80 via-emerald-50/60 to-teal-50/80",
      iconColor: "text-green-500",
      features: ["Ultra-Soft Bristles", "Sensitive Formula", "Gentle Clean"],
      price: "From ₹99"
    }
  ];

  // Filter categories based on search
  const filteredCategories = categories.filter(category => {
    const searchLower = search.toLowerCase();
    return (
      category.title.toLowerCase().includes(searchLower) ||
      category.description.toLowerCase().includes(searchLower)
    );
  });

  const handleCategoryClick = (categoryId) => {
    // Add smooth transition effect
    const card = document.querySelector(`.category-card[data-category="${categoryId}"]`);
    if (card) {
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        card.style.transform = '';
        navigate(`/shop/${categoryId}`);
      }, 200);
    } else {
      navigate(`/shop/${categoryId}`);
    }
  };

  // StarRating component for dynamic stars
  const StarRating = ({ rating, totalStars = 5 }) => {
    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} color="#fbbf24" size={20} />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} color="#fbbf24" size={20} />);
      } else {
        stars.push(<FaRegStar key={i} color="#fbbf24" size={20} />);
      }
    }
    return <span style={{ display: 'flex', gap: 4 }}>{stars}</span>;
  };

  return (
    <div className="category-container">
      {/* Header Section */}
      <div className="category-header-section">
        <h1 className="category-title">Our Categories</h1>
        <p className="category-subtitle">
          Discover our premium collection of toothbrushes, each category thoughtfully designed 
          to meet specific oral care needs with cutting-edge technology and superior comfort.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="category-grid">
        {filteredCategories.map((category, index) => {
          const IconComponent = category.icon;
          // Assign a type class for background (children, adult, essential)
          let typeClass = '';
          if (category.id === 'children') typeClass = 'children';
          else if (category.id === 'adult') typeClass = 'adult';
          else typeClass = 'essential';
          return (
            <div 
              key={category.id} 
              className={`category-card ${typeClass}`} 
              onClick={() => handleCategoryClick(category.id)}
              data-category={category.id}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleCategoryClick(category.id);
                }
              }}
            >
              <div className="category-header">
                <div className="category-icon-wrapper">
                  <div className="category-icon">
                    <IconComponent className={category.iconColor} />
                  </div>
                  <div className="category-arrow">
                    <ArrowRight className="w-5 h-5 text-gray-700" />
                  </div>
                </div>
                <h2>{category.title}</h2>
                <div className="subtitle">{category.subtitle}</div>
                <p>{category.description}</p>
              </div>
              {/* Features */}
              <div className="category-features">
                {category.features.map((feature, idx) => (
                  <div key={idx} className="category-feature">
                    <span className="feature-dot"></span>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>
              {/* Price */}
              <div className="category-price">{category.price}</div>
              {/* CTA Button */}
              <button 
                className="view-all-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryClick(category.id);
                }}
              >
                Explore Collection <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              {/* Floating elements for effect */}
              <div className="floating-element-1"></div>
              <div className="floating-element-2"></div>
            </div>
          );
        })}
      </div>

      {/* Social Proof Section */}
      <div className="category-social-proof" style={{ marginTop: 60 }}>
        <div className="social-proof-badge">
          <div className="rating-stars">
            <StarRating rating={4.9} />
          </div>
          <div className="rating-text">
            <span className="rating-score">4.9/5</span>
            <span style={{ marginLeft: 8 }}>from 10,000+ happy customers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
