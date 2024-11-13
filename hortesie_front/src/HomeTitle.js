// HomeTitle.jsx
import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as HortesieLogo } from "./components/logo/Hortesie-rouge-et-or.svg";

import { Routes, Route, Link } from "react-router-dom";
import "./HomeTitle.css";

const HomeTitle = () => {
  const [isVisible, setIsVisible] = useState(false);

  const itemRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const item = itemRef.current;

    const animationCompleteHandler = () => {
      item.querySelector(".underline").classList.add("animation-complete");
    };

    item.addEventListener("transitionend", animationCompleteHandler);

    return () => {
      item.removeEventListener("transitionend", animationCompleteHandler);
    };
  }, []);
  return (
    <div className="home-title-container">
      <div className="home-title-subcontainer" ref={itemRef}>
        <HortesieLogo
          className={`home-title ${isVisible ? "home-visible" : ""}`}
        />
        <div className="underline"></div>
      </div>
      <Link
        to="/projets"
        className={`home nav-links ${isVisible ? "home-visible" : ""}`}
      >
        Projets
      </Link>
      <Link
        to="/etudes"
        className={`home nav-links ${isVisible ? "home-visible" : ""}`}
      >
        Études
      </Link>
      <Link
        to="/etudes"
        className={`home nav-links ${isVisible ? "home-visible" : ""}`}
      >
        Articles
      </Link>
      <Link
        to="/a-propos"
        className={`home nav-links ${isVisible ? "home-visible" : ""}`}
      >
        À propos
      </Link>
      <Link
        to="/contact"
        className={`home nav-links ${isVisible ? "home-visible" : ""}`}
      >
        Contact
      </Link>
    </div>
  );
};

export default HomeTitle;
