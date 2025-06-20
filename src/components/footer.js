import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => (
  <footer
    style={{
      background: "#f4f6fc",
      color: "#333",
      padding: "32px 0 16px 0",
      textAlign: "center",
      marginTop: 40,
      borderTop: "1px solid #e0e0e0",
    }}
  >
    <div
      style={{
        fontWeight: 700,
        fontSize: 22,
        color: "#07b39b",
        marginBottom: 8,
      }}
    >
      Banat
    </div>
    <div style={{ marginBottom: 16, fontSize: 15 }}>
      &copy; {new Date().getFullYear()} Banat. All rights reserved.
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 24,
        fontSize: 22,
      }}
    >
      <a 
        href="https://facebook.com/banat" 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ color: "#07b39b" }} 
        aria-label="Visit our Facebook page"
      >
        <FaFacebook />
      </a>
      <a 
        href="https://instagram.com/banat" 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ color: "#07b39b" }} 
        aria-label="Visit our Instagram page"
      >
        <FaInstagram />
      </a>
      <a 
        href="https://twitter.com/banat" 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ color: "#07b39b" }} 
        aria-label="Visit our Twitter page"
      >
        <FaTwitter />
      </a>
    </div>
  </footer>
);

export default Footer;
