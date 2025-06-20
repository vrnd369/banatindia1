import React, { useState, useEffect } from "react";
import Loader from "./components/loader";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/footer";
import { auth } from "./firebase/config";
import { AuthProvider } from "./contexts/AuthContext";

import Home from "./pages/home";
import About from "./pages/about";
import Category from "./pages/category";
import Shop from "./pages/shop";
import Contact from "./pages/contact";
import Login from "./pages/login";
import SignupForm from "./pages/signup";
import ShoppingCart from "./pages/ShoppingCart";
import Dashboard from "./pages/dashboard";
import Wishlist from "./pages/wishlist";
import Checkout from "./pages/checkout";

function App() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      // Clear cart when user signs out
      if (!user) {
        setCart([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (product) => {
    // Only add to cart if user is logged in
    if (!user) {
      alert("Please sign in to add items to cart");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const incrementQuantity = (id) => {
    if (!user) return;
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id) => {
    if (!user) return;

    setCart((prevCart) =>
      prevCart.reduce((acc, item) => {
        if (item.id === id) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
    );
  };

  const removeFromCart = (id) => {
    if (!user) return;
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const addToWishlist = (product) => {
    if (!user) {
      alert("Please sign in to add items to wishlist");
      return;
    }

    setWishlist((prevWishlist) => {
      if (!prevWishlist.find((item) => item.id === product.id)) {
        return [...prevWishlist, product];
      }
      return prevWishlist;
    });
  };

  const removeFromWishlist = (productId) => {
    if (!user) return;
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.id !== productId)
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <AuthProvider>
      <Router>
        <Header cartItems={cart} wishlist={wishlist} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route 
            path="/shop" 
            element={
              <Shop 
                addToCart={addToCart} 
                wishlist={wishlist}
                addToWishlist={addToWishlist}
                removeFromWishlist={removeFromWishlist}
              />
            } 
          />
          <Route 
            path="/shop/:category" 
            element={
              <Shop 
                addToCart={addToCart} 
                wishlist={wishlist}
                addToWishlist={addToWishlist}
                removeFromWishlist={removeFromWishlist}
              />
            } 
          />
          <Route
            path="/cart"
            element={
              <ShoppingCart 
                cartItems={cart}
                onRemove={removeFromCart}
                onQuantityChange={(id, action) => {
                  if (action === 'increase') {
                    incrementQuantity(id);
                  } else {
                    decrementQuantity(id);
                  }
                }}
              />
            }
          />
          <Route
            path="/checkout"
            element={<Checkout />}
          />
          <Route
            path="/wishlist"
            element={
              <Wishlist
                wishlist={wishlist}
                onRemoveFromWishlist={removeFromWishlist}
                onAddToCart={addToCart}
              />
            }
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
