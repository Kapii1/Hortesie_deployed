import "./App.css";
import { Projets } from "./components/routes/Project";
import { Routes, Route, Link } from "react-router-dom";
import { React, useState } from "react";
import { Apropos } from "./components/routes/A-propos";
import { Contact } from "./components/routes/Contact";
import { ListProjectAdmin } from "./components/routes/list-admin/List-Project-admin";
import Login from "./components/routes/list-admin/Login";
function App() {
  const [color, changeColor] = useState("#282c34");
  return (
    <div className="App">
      <div>
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
          <div className="menu-icon"></div>
          <ul>
            <li>
              <Link to="/a-propos" className="nav-links">
                À propos
              </Link>
            </li>
            <li>
              <Link to="/projets" prefetch={false} className="nav-links">
                Projets
              </Link>
            </li>
            <li>
              <Link to="/contact" className="nav-links">
                Contact
              </Link>
            </li>
          </ul>
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
