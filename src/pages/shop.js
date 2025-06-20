import React, { useState, useEffect } from 'react';
import { FaChild, FaUser, FaUserPlus, FaShoppingBag, FaHeart, FaCheck } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import './shop.css';

// Import your images here
import pic4 from '../assets/pic4.jpg';
import pic5 from '../assets/pic5.avif';
import pic6 from '../assets/pic6.jpg';
import pic7 from '../assets/pic7.avif';
import pic8 from '../assets/pic8.avif';
import pic9 from '../assets/pic9.jpg';
import pic10 from '../assets/pic10.avif';
import pic11 from '../assets/pic11.avif';
import pic12 from '../assets/pic12.avif';

// Default fallback image
const fallbackImage = 'https://via.placeholder.com/120x120?text=Banat+Toothbrush';

// Image loading error handler
const handleImageError = (e) => {
  e.target.onerror = null;
  e.target.src = fallbackImage;
};

const childrenProducts = [
  { 
    id: 1, 
    name: "Kids Soft Toothbrush", 
    price: 99, 
    image: pic4, 
    fallback: fallbackImage,
    category: "children",
    description: "Perfect for children's sensitive teeth and gums. Recommended for ages 3-6."
  },
  { 
    id: 2, 
    name: "Children's Medium Bristle", 
    price: 120, 
    image: pic5, 
    fallback: fallbackImage,
    category: "children",
    description: "Designed for kids 5-12 years. Helps develop good brushing habits."
  },
  { 
    id: 3, 
    name: "Kids Special Brush", 
    price: 85, 
    image: pic6, 
    fallback: fallbackImage,
    category: "children",
    description: "Fun design for young children with extra-soft bristles for gentle cleaning."
  }
];

const adultProducts = [
  { 
    id: 4, 
    name: "Soft Adult Brush", 
    price: 150, 
    image: pic7, 
    category: "adult",
    description: "Gentle on gums with advanced cleaning technology for adults."
  },
  { 
    id: 5, 
    name: "Medium Adult Brush", 
    price: 180, 
    image: pic8, 
    category: "adult",
    description: "Perfect balance of cleaning power and comfort for daily use."
  },
  { 
    id: 6, 
    name: "Hard Adult Brush", 
    price: 200, 
    image: pic9, 
    category: "adult",
    description: "Deep cleaning action for adults who prefer firmer bristles."
  }
];

const oldAgeProducts = [
  { 
    id: 7, 
    name: "Soft Old Age Brush", 
    price: 130, 
    image: pic10, 
    category: "old-age",
    description: "Extra soft bristles specially designed for sensitive gums and teeth."
  },
  { 
    id: 8, 
    name: "Medium Old Age Brush", 
    price: 160, 
    image: pic11, 
    category: "old-age",
    description: "Comfortable grip handle with medium-soft bristles for better control."
  },
  { 
    id: 9, 
    name: "Special Old Age Brush", 
    price: 190, 
    image: pic12, 
    category: "old-age",
    description: "Easy-grip design perfect for those with arthritis or limited mobility."
  }
];

const allProducts = [...childrenProducts, ...adultProducts, ...oldAgeProducts];

const Shop = ({ addToCart = () => {}, wishlist = [], addToWishlist = () => {}, removeFromWishlist = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentCategory, setCurrentCategory] = useState('all');
  const [addedItems, setAddedItems] = useState({});

  useEffect(() => {
    // Extract category from URL path
    const pathParts = location.pathname.split('/');
    const categoryFromUrl = pathParts[pathParts.length - 1];
    if (categoryFromUrl && categoryFromUrl !== 'shop') {
      setCurrentCategory(categoryFromUrl);
    } else {
      setCurrentCategory('all');
    }
  }, [location]);

  const getFilteredProducts = () => {
    if (currentCategory === 'all' || !currentCategory) {
      return allProducts;
    }
    return allProducts.filter(product => 
      product.category.toLowerCase() === currentCategory.toLowerCase()
    );
  };

  const handleCategoryClick = (category) => {
    setCurrentCategory(category);
    
    // Update URL based on category
    if (category === 'all') {
      navigate('/shop');
    } else {
      navigate(`/shop/${category.replace(' ', '-')}`);
    }
  };

  const handleWishlistClick = (product) => {
    if (wishlist.find(item => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (product) => {
    addToCart({...product, quantity: 1});
    setAddedItems(prev => ({
      ...prev,
      [product.id]: true
    }));
    
    // Reset the added state after 2 seconds
    setTimeout(() => {
      setAddedItems(prev => ({
        ...prev,
        [product.id]: false
      }));
    }, 2000);
  };

  return (
    <div className="shop-container">
      <div className="category-filters">
        <button 
          className={`category-btn ${currentCategory === 'all' || !currentCategory ? 'active' : ''}`}
          onClick={() => handleCategoryClick('all')}
          data-category="all"
        >
          <FaShoppingBag className="category-icon" /> All Products
        </button>
        <button 
          className={`category-btn ${currentCategory === 'children' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('children')}
          data-category="children"
        >
          <FaChild className="category-icon" /> Children's Toothbrushes
        </button>
        <button 
          className={`category-btn ${currentCategory === 'adult' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('adult')}
          data-category="adult"
        >
          <FaUser className="category-icon" /> Adult Toothbrushes
        </button>
        <button 
          className={`category-btn ${currentCategory === 'old-age' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('old-age')}
          data-category="old-age"
        >
          <FaUserPlus className="category-icon" /> Old Age Toothbrushes
        </button>
      </div>

      <div className="products-grid">
        {getFilteredProducts().map(product => (
          <div className="product-card" key={product.id}>
            <div className="product-image-container">
              <img
                src={product.image} 
                alt={product.name} 
                className="product-image"
                onError={handleImageError}
                loading="lazy"
              />
            </div>
            <div className="product-details">
              <h4>{product.name}</h4>
              <p className="product-description">{product.description}</p>
              <p className="product-price">₹{product.price}</p>
              <div className="product-actions-row">
                <button 
                  className={`add-to-cart-btn ${addedItems[product.id] ? 'added' : ''}`} 
                  onClick={() => handleAddToCart(product)}
                >
                  {addedItems[product.id] ? (
                    <>
                      <FaCheck className="action-icon" />
                      ADDED TO BAG
                    </>
                  ) : (
                    <>
                      <FaShoppingBag className="action-icon" />
                      ADD TO BAG
                    </>
                  )}
                </button>
                <button 
                  className={`wishlist-btn${wishlist.find(item => item.id === product.id) ? ' wishlisted' : ''}`}
                  onClick={() => handleWishlistClick(product)}
                >
                  <FaHeart className="action-icon" />
                  {wishlist.find(item => item.id === product.id) ? 'WISHLISTED' : 'WISHLIST'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
