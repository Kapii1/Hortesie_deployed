import React, {Component} from "react";
import {MenuItem} from "./MenuItem"
import './Navbar.css'
class Navbar extends Component{
render() {
    return(
        <div className="nav-container">
        <nav className="NavbarItems">
            <h1 className="navbar-logo"><div className="title">HORTÉSIE</div><div className="subtitle">Paysage et urbanisme</div> <i className="fab fa-react"></i></h1>
            <div className="menu-icon">
                
            </div>
            <ul>
                {MenuItem.map((item,index) => {
                    return(
                    <li key={index}>
                        <a className={item.cName} href={item.url}>
                        {item.title}
                        </a>
                        </li>
                    )
                })}

            </ul>

            
        </nav>
        </div>
    )
}

}

export default Navbar