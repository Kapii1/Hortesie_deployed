import "./App.css";
import { Projets } from "./components/routes/Project";
import { Routes, Route, Link } from "react-router-dom";
import { React, useEffect, useState } from "react";
import { Apropos } from "./components/routes/A-propos";
import { Contact } from "./components/routes/Contact";
import { ListProjectAdmin } from "./components/routes/list-admin/List-Project-admin";
import Login from "./components/routes/list-admin/Login";
import { ReactComponent as HortesieLogo } from "./components/logo/Hortesie-rouge-et-or.svg";
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async';

import Footer from "./footer";
function App() {
  const [color, changeColor] = useState("#282c34");
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  console.log(!(location.pathname.includes("admin")))
  useEffect(() => {
    const navbar = document.getElementsByClassName("navbar-ul")[0];
    const menu_icon = document.getElementsByClassName("menu-icon")[0];
    navbar.style.left = collapsed ? "0" : "100vw";
    menu_icon.style.transform = collapsed
      ? "translateX(-75vw)"
      : "translateX(-5vw)";
  }, [collapsed]);
  return (
    <div className="App">
      <Helmet>
        <title>{"Hortesie"}</title>
        <link rel="canonical" href={"https://hortesie.fr"} />
      </Helmet>
      <div className="top-container">
        <nav className="NavbarItems">
          <Link to="/" className="nav-title">
            <div className="navbar-logo">
              <div className="logo-container">
                <img
                  className="logo-img"
                  src={require("./Hortesie_rouge_et_or__1_-removebg-preview_recadré.png")}
                ></img>
              </div>
              <HortesieLogo />
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
        <div className="bar-navbar-container">
          <div className="bar-navbar">

          </div>
        </div>
      </div>

      <Routes>
        <Route path="/" />
        <Route path="a-propos" exact element={<Apropos />} />
        <Route path="projets/*" exact element={<Projets />} />
        <Route path="contact" exact element={<Contact />} />
        <Route path="admin/*" exact element={<ListProjectAdmin />} />
      </Routes>
      {(location.pathname != "/" & !(location.pathname.includes("admin"))) ? <Footer></Footer> : ""}
    </div>
  );
}

export default App;
