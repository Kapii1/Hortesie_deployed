import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Login.css";
import { Button, TextField } from "@mui/material";
import { API_URL } from "../../../url";

import { Store } from 'react-notifications-component';

async function loginUser(credentials) {
  const res = await fetch(API_URL + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
  if (res.status === 200) {
    return (res.json())
  }
  return (404)
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password,
    });
    if (token !== 404) {
      setToken(token);
    }
    else {
      Store.addNotification({
        title: "Mauvais identifiants !",
        message: "Les identifiants que vous avez entrés sont incorrects.",
        type: "danger",
        insert: "top",
        container: "bottom-center",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true
        }
      });
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-in-wrapper">
        <form className="form-wrapper" onSubmit={handleSubmit}>
          <label>
            <p>Utilisateur T21ESTS</p>
            <TextField
              type="text"
              onChange={(e) => setUserName(e.target.value)}
            />
          </label>
          <label>
            <p>Mot de passe</p>
            <TextField
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <div className="button-connexion">
            <Button type="submit">Se connecter </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
