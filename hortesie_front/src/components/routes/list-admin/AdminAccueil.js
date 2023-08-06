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
            <div>
                <Link to="projets">Projets</Link>
            </div>
            <div>
                <Link to='tools'> Outils CCTP</Link>
            </div>
        </div>
    )
}