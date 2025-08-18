import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar({ collapsed, setCollapsed }) {
  return (
    <ul
      id="primary-navigation"
      className={`navbar-ul${collapsed ? " open" : ""}`}
    >
      <li className="navbar-li">
        <NavLink
          to="/a-propos"
          className={({ isActive }) => `nav-links${isActive ? " active" : ""}`}
          onClick={async () => {
            setCollapsed(false);
          }}
        >
          À propos
        </NavLink>
      </li>
      <li className="navbar-li">
        <NavLink
          to="/projets"
          className={({ isActive }) => `nav-links${isActive ? " active" : ""}`}
          onClick={async () => {
            setCollapsed(false);
          }}
        >
          Projets
        </NavLink>
      </li>
      <li className="navbar-li">
        <NavLink
          to="/articles"
          className={({ isActive }) => `nav-links${isActive ? " active" : ""}`}
          onClick={async () => {
            setCollapsed(false);
          }}
        >
          Articles
        </NavLink>
      </li>
      <li className="navbar-li">
        <NavLink
          to="/contact"
          className={({ isActive }) => `nav-links${isActive ? " active" : ""}`}
          onClick={async () => {
            setCollapsed(false);
          }}
        >
          Contact
        </NavLink>
      </li>
    </ul>
  );
}
