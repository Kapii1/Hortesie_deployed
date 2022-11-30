import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Routes, Route } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ListProject from "./ListProject.css";
import { OneRowAdmin } from "./OneRow";
import DeleteIcon from "@mui/icons-material/Delete";
import { DetailAdmin } from "./Detail-admin";
import Save from "@mui/icons-material/Save";
import { Button, Icon } from "@mui/material";
import Login from "./Login";
import { API_URL } from "../../../url";
import useToken from "./useToken";
import { New_Project } from "./New-project";

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update state to force render
  // An function that increment 👆🏻 the previous state like here
  // is better than directly setting `value + 1`
}

export function ListProjectAdmin() {
  const [reRender, setReRender] = useState(false);

  const delProjet = async (id) => {
    const res = await fetch(API_URL + "/del_projet", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    setReRender(!reRender);
  };
  const handleReRender = () => {
    setReRender(!reRender); // state change will re-render parent
  };
  const location = useLocation();
  const [loading, setLoading] = useState();
  const [data, setData] = useState();

  async function fetchData() {
    setLoading(true);
    fetch(API_URL + "/projets", { method: "GET" })
      .then((response) => response.json())
      .then((responseJson) => {
        setData(responseJson);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }

  const { token, setToken } = useToken();
  const [deleted, isDeleted] = useState();
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  useEffect(() => {
    fetch(API_URL + "/welcome_admin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    })
      .then((res) => res.text())
      .then((res) => {
        if (res == "not good") {
          setToken(false);
        }
      });
  });
  useEffect(() => {
    fetchData();
  }, [deleted]);
  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className="all-admin-container">
      <div className="admin-button-container">
        <div className="button-admin add-project-admin">
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="new_project"
          >
            <Button sx={{ fontSize: 20 }} startIcon={<AddIcon />}>
              Ajouter projet
            </Button>
          </Link>
        </div>
      </div>
      <div className="admin-list-container">
        <div className="admin-list">
          <div className="one-row-header">
            <div className="supp-title">
              <DeleteIcon />
            </div>
            <div className="elem-title"> Vignette</div>
            <div className="elem-title"> Nom Projet</div>
            <div className="elem-title"> Ville </div>
          </div>

          {data &&
            data.map((item, i) => {
              console.log("item", item.nom);
              return (
                <div className="del-row-container">
                  <div className="del-button">
                    <IconButton
                      onClick={() => {
                        delProjet(item.id);
                        isDeleted(!deleted);
                      }}
                    >
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                  </div>
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "black",
                      width: "95%",
                    }}
                    to={item.id}
                  >
                    <OneRowAdmin
                      nom={item.nom}
                      vignette={item.vignette}
                      ind={i}
                      ville={item.ville}
                      key={i}
                    />
                  </Link>
                </div>
              );
            })}
        </div>

        <Routes location={location} key={location.key}>
          <Route path="/" />
          <Route
            path="/:id"
            element={<DetailAdmin onReRender={handleReRender} />}
          />
          <Route path="/new_project" element={<New_Project />} />
        </Routes>
      </div>
    </div>
  );
}
