import "./App.css";
import { Projets } from "./components/routes/Project";
import { Routes, Route, Link } from "react-router-dom";
import {  useEffect, useRef, useState } from "react";
import React from "react";
import { Apropos } from "./components/routes/A-propos";
import { Contact } from "./components/routes/Contact";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ReactComponent as HortesieLogo } from "./components/logo/Hortesie-rouge-et-or.svg";
import Footer from "./footer";
import HomeTitle from "./HomeTitle";
import Navbar from "./Navbar";
import { ReactComponent as HamburgerIcon } from './hamburger-menu-svgrepo-com.svg'

const AdminRouter= React.lazy(() => import("./components/routes/list-admin/AdminRouter"));

const setOpacityRecursive = (element, opacity) => {
  if (element && element.children) {
    const childElements = element.children;
    for (let i = 0; i < childElements.length; i++) {
      if (childElements[i].className === "nav-links") {
        childElements[i].style.opacity = opacity;
      }
      setOpacityRecursive(childElements[i], opacity);
    }
  }
};

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const navBarRef = useRef();
  const barnavBarRef = useRef();
  const appRef = useRef();
  const location = useLocation();
  useEffect(() => {
    const navbar = document.getElementsByClassName("navbar-ul")[0];
    const menu_icon = document.getElementsByClassName("menu-icon")[0];
    navbar.style.left = collapsed ? "0" : "100vw";
  }, [collapsed]);
  useEffect(() => {
    if (location.pathname === "/") {
      navBarRef.current.style.display = "none";
      barnavBarRef.current.style.display = "none";
      appRef.current.style.display = "flex";
    } else {
      navBarRef.current.style.display = "flex";
      barnavBarRef.current.style.display = "block";
      appRef.current.style.display = null;
    }
  }, [location]);
  return (
    <div className="App" ref={appRef}>
      <Helmet>
        <title>{"Hortesie"}</title>
        <link rel="canonical" href={"https://hortesie.fr"} />
      </Helmet>
      <div className="top-container">
        <nav className="NavbarItems" ref={navBarRef}>
          <Link to="/">
            <div className="home-logo">
              <HortesieLogo></HortesieLogo>
            </div>
          </Link>

          <Navbar setCollapsed={setCollapsed}/>
          <div
            className="menu-icon"
            onClick={async () => {
              setCollapsed(!collapsed);
            }}
          >
            <HamburgerIcon/>
          </div>
        </nav>
        <div className="bar-navbar-container" ref={barnavBarRef}>
          <div className="bar-navbar"></div>
        </div>
      </div>

        <Routes>
          <Route path="/" exact element={<HomeTitle></HomeTitle>} />
          <Route path="a-propos" exact element={<Apropos />} />
          <Route
            path="projets/*"
            exact
            element={<Projets filter="projets" />}
          />
          <Route path="etudes/*" exact element={<Projets filter="etudes" />} />
          <Route path="articles/" exact element={<Projets filter="etudes" />} />
          <Route path="contact" exact element={<Contact />} />

          <Route
            path="admin/*"
            
            element={
              <AdminRouter/>
            }
          />
        </Routes>
      {(location.pathname != "/") & !location.pathname.includes("admin") ? (
        <Footer></Footer>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
