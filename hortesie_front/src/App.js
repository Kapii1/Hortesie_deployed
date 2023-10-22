import "./App.css";
import { Projets } from "./components/routes/Project";
import { Routes, Route, Link } from "react-router-dom";
import { React, useEffect, useRef, useState } from "react";
import { Apropos } from "./components/routes/A-propos";
import { Contact } from "./components/routes/Contact";
import { ListProjectAdmin } from "./components/routes/list-admin/List-Project-admin";
import Login from "./components/routes/list-admin/Login";
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async';
import AdminAccueil from "./components/routes/list-admin/AdminAccueil";
import Toolpage from "./components/routes/list-admin/EZtool/PageTools";
import { ReactComponent as HortesieLogo } from "./components/logo/Hortesie-rouge-et-or.svg";

import Footer from "./footer";
import HomeTitle from "./HomeTitle";

const setOpacityRecursive = (element, opacity) => {
  if (element && element.children) {
    const childElements = element.children;
    for (let i = 0; i < childElements.length; i++) {
      console.log(childElements)
      if (childElements[i].className === "nav-links") {


        childElements[i].style.opacity = opacity;
      }
      setOpacityRecursive(childElements[i], opacity);
    }
  }
};
function App() {
  const [color, changeColor] = useState("#282c34");
  const [collapsed, setCollapsed] = useState(false);
  const navBarRef = useRef()
  const barnavBarRef = useRef()
  const appRef = useRef()
  const location = useLocation();
  console.log(!(location.pathname.includes("admin")))
  useEffect(() => {
    const navbar = document.getElementsByClassName("navbar-ul")[0];
    const menu_icon = document.getElementsByClassName("menu-icon")[0];
    navbar.style.left = collapsed ? "0" : "100vw";

  }, [collapsed]);
  useEffect(() => {
    if (location.pathname === "/") {
      navBarRef.current.style.display = 'none'
      barnavBarRef.current.style.display = 'none'
      appRef.current.style.display = 'flex'
    } else {
      navBarRef.current.style.display = "flex"
      barnavBarRef.current.style.display = "block"
      appRef.current.style.display = null
    }
  }, [location])
  return (
    <div className="App" ref={appRef} >
      <Helmet>
        <title>{"Hortesie"}</title>
        <link rel="canonical" href={"https://hortesie.fr"} />
      </Helmet>
      <div className="top-container">
        <nav className="NavbarItems" ref={navBarRef}>
          

            {/* <img className="home-logo-img" src={require('./logo.png')}></img> */}
            <Link to="/">
            <div className="home-logo">
            <HortesieLogo></HortesieLogo>
            </div>

            </Link>
          <ul className="navbar-ul">
            <li className="navbar-li">
              <Link
                to="/a-propos"
                className="nav-links"
                onClick={async () => {
                  setCollapsed(!collapsed);
                }}
              >
                À propos
              </Link>
            </li>
            <li className="navbar-li">
              <Link
                to="/projets"
                prefetch={false}
                className="nav-links"
                onClick={async () => {
                  setCollapsed(!collapsed);
                }}
              >
                Projets
              </Link>
            </li>
            <li className="navbar-li">
              <Link
                to="/etudes"
                prefetch={false}
                className="nav-links"
                onClick={async () => {
                  setCollapsed(!collapsed);
                }}
              >
                Études
              </Link>
            </li>
            <li className="navbar-li">
              <Link
                to="/articles"
                prefetch={false}
                className="nav-links"
                onClick={async () => {
                  setCollapsed(!collapsed);
                }}
              >
                Articles
              </Link>
            </li>
            <li className="navbar-li">
              <Link
                to="/contact"
                className="nav-links"
                onClick={async () => {
                  setCollapsed(!collapsed);
                }}
              >
                Contact
              </Link>
            </li>
          </ul>
          <div
            className="menu-icon"
            onClick={async () => {
              setCollapsed(!collapsed);
            }}
          >
            <div className="menu-icon-item"></div>
            <div className="menu-icon-item"></div>
            <div className="menu-icon-item"></div>
          </div>
        </nav>
        <div className="bar-navbar-container" ref={barnavBarRef}>
          <div className="bar-navbar">

          </div>
        </div>
      </div>

      <Routes>
        <Route path="/" exact element={<HomeTitle></HomeTitle>} />
        <Route path="a-propos" exact element={<Apropos />} />
        <Route path="projets/*" exact element={<Projets filter="projets" />} />
        <Route path="etudes/*" exact element={<Projets filter="etudes" />} />
        <Route path="articles/" exact element={<Projets filter="etudes" />} />
        <Route path="contact" exact element={<Contact />} />
        <Route path="admin" exact element={<AdminAccueil />} />
        <Route path="admin/projets/*" exact element={<ListProjectAdmin />} />
        <Route path="admin/tools" exact element={<Toolpage />} />
      </Routes>
      {(location.pathname != "/" & !(location.pathname.includes("admin"))) ? <Footer></Footer> : ""}
    </div>
  );
}

export default App;
