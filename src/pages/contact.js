// src/pages/Contact.js
import React from "react";
import "./category.css";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Contact = () => {
  return (
    <div style={{ padding: "40px 0", background: "#fff" }}>
      <h2
        style={{
          textAlign: "center",
          color: "#07b39b",
          fontWeight: 700,
          marginBottom: 40,
        }}
      >
        Contact Us
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 40,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "#f4f6fc",
            borderRadius: 24,
            padding: "48px 32px",
            minWidth: 340,
            textAlign: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
          }}
        >
          <FaMapMarkerAlt
            size={48}
            color="#07b39b"
            style={{ marginBottom: 24 }}
          />
          <div style={{ fontSize: 20, color: "#333", marginBottom: 0 }}>
            3-601/2 First Floor, Pedda Golconda, Shamshabad,
            <br />
            Hyderabad, India – 501218
          </div>
        </div>
        <div
          style={{
            background: "#f4f6fc",
            borderRadius: 24,
            padding: "48px 32px",
            minWidth: 340,
            textAlign: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
          }}
        >
          <FaPhoneAlt size={48} color="#07b39b" style={{ marginBottom: 24 }} />
          <div style={{ fontSize: 20, color: "#333", marginBottom: 0 }}>
            +91 7207149900
          </div>
        </div>
        <div
          style={{
            background: "#f4f6fc",
            borderRadius: 24,
            padding: "48px 32px",
            minWidth: 340,
            textAlign: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
          }}
        >
          <FaEnvelope size={48} color="#07b39b" style={{ marginBottom: 24 }} />
          <div style={{ fontSize: 20, color: "#333", marginBottom: 0 }}>
            info@parwahindustries.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
