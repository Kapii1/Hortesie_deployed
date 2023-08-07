import React from "react";
import ImportFile from "./EZtool/Tool";
import { ListProjectAdmin } from "./List-Project-admin";
import { Link, Route, Routes } from "react-router-dom";

import './AdminAccueil.css'
import useToken from "./useToken";
import Login from "./Login";
export default function AdminAccueil() {
    const { token, setToken } = useToken();
    if (!token) {
        return <Login setToken={setToken} />;
    }
    return (
        <div className="accueil">

            <Link className="admin-links" to="projets"><div>Projets</div></Link>


            <Link className="admin-links" to='tools'>
                <div>
                    Outils CCTP
                </div>
            </Link>

        </div>
    )
}