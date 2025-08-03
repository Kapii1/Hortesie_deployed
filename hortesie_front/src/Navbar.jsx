import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({setCollapsed}) {
  return (
    <ul className="navbar-ul">
      <li className="navbar-li">
        <Link
          to="/a-propos"
          className="nav-links"
          onClick={async () => {
            setCollapsed(collapsed=>!collapsed);
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
            setCollapsed(collapsed=>!collapsed);
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
            setCollapsed(collapsed=>!collapsed);
          }}
        >
          Études
        </Link>
      </li>
      {/*<li className="navbar-li">*/}
      {/*  <Link*/}
      {/*    to="/articles"*/}
      {/*    prefetch={false}*/}
      {/*    className="nav-links"*/}
      {/*    onClick={async () => {*/}
      {/*      setCollapsed(collapsed=>!collapsed);*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    Articles*/}
      {/*  </Link>*/}
      {/*</li>*/}
      <li className="navbar-li">
        <Link
          to="/contact"
          className="nav-links"
          onClick={async () => {
            setCollapsed(collapsed=>!collapsed);
          }}
        >
          Contact
        </Link>
      </li>
    </ul>
  );
}
