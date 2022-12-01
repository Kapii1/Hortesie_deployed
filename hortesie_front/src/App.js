import "./App.css";
import { Projets } from "./components/routes/Project";
import { Routes, Route, Link } from "react-router-dom";
import { React, useEffect, useState } from "react";
import { Apropos } from "./components/routes/A-propos";
import { Contact } from "./components/routes/Contact";
import { ListProjectAdmin } from "./components/routes/list-admin/List-Project-admin";
import Login from "./components/routes/list-admin/Login";
function App() {
  const [color, changeColor] = useState("#282c34");
  const [collapsed, setCollapsed] = useState(true);
  useEffect(() => {
    const navbar = document.getElementsByClassName("navbar-ul")[0];
    const menu_icon = document.getElementsByClassName("menu-icon")[0];
    console.log(menu_icon);
    navbar.style.left = collapsed ? "0" : "100vw";
    menu_icon.style.transform = collapsed
      ? "translateX(-75vw)"
      : "translateX(-5vw)";
  }, [collapsed]);
  return (
    <div className="App">
      <div className="top-container">
        <nav className="NavbarItems">
          <Link to="/" className="nav-title">
            <div className="navbar-logo">
              <div className="logo-container">
                <img className="logo-img" src={require("./logo.png")}></img>
              </div>
              <div className="title-container">
                <div className="title">HORTÉSIE</div>
                <div className="subtitle">
                  <a>Paysage et urbanisme</a>
                </div>
              </div>
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
      </div>

      <Routes>
        <Route path="/" />
        <Route path="a-propos" exact element={<Apropos />} />
        <Route path="projets/*" exact element={<Projets />} />
        <Route path="contact" exact element={<Contact />} />
        <Route path="admin/*" exact element={<ListProjectAdmin />} />
      </Routes>
    </div>
  );
}

export default App;
