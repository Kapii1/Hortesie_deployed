import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar({setCollapsed}) {
  return (
    <ul className="navbar-ul">
      <li className="navbar-li">
        <NavLink
          to="/a-propos"
          className={({ isActive }) => `nav-links${isActive ? " active" : ""}`}
          onClick={async () => {
            setCollapsed(collapsed=>!collapsed);
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
            setCollapsed(collapsed=>!collapsed);
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
            setCollapsed(collapsed=>!collapsed);
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
            setCollapsed(collapsed=>!collapsed);
          }}
        >
          Contact
        </NavLink>
      </li>
    </ul>
  );
}
