import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Login.css";
import { Button, TextField } from "@mui/material";
import { API_URL } from "../../../url";

async function loginUser(credentials) {
  return fetch(API_URL + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
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

    setToken(token);
  };

  return (
    <div className="login-wrapper">
      <div className="login-in-wrapper">
        <form onSubmit={handleSubmit}>
          <label>
            <p>Utilisateur</p>
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
