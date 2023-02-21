import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import SaveIcon from "@mui/icons-material/Save";
import { Button } from "@mui/material";
import { Store } from 'react-notifications-component';
import { API_URL } from "../../../url";
import { useHistory } from 'react-router';

export function New_Project(props) {
  const { onReRender } = props;
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  const id = s4() + s4() + s4();
  const [imgs, setimgs] = useState([]);

  const format_new_data_to_save = async () => {
    const creation = await create_project();
    var new_data = [];
    var today = new Date();
    var yyyy = today.getFullYear();

    today = yyyy;

    const nom_projet = document.getElementById("nom-projet").value;
    const description = document.getElementById("description-projet").value;
    const ville = document.getElementById("ville-projet").value;
    var list_of_img = [];
    new_data = await {
      id: id,
      nom: nom_projet,
      description: description,
      date: today,
      type: "projet",
      vignette: "",
      ville: ville,
      images: [],
    };
    const res = await fetch(API_URL + "/save_modif_project", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(new_data),
    }).then((res) => {
      if (res.status === 200) {
        Store.addNotification({
          title: "Créé",
          message: <div> Vous pouvez vous rendre sur le menu du projet  <a href={'/admin/' + id}>
            en cliquant ici
          </a>
          </div>,
          type: "success",
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
    });

    onReRender();
    return new_data;
  };

  const create_project = async () => {
    const res = await fetch(API_URL + "/add_project", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    const response_json = await res.json();
    return response_json;
  };

  return (
    <div className="Detail-container">
      <div className="titre-container">
        <div className="titre-ajout">
          <label>Ajout d'un projet</label>
        </div>
      </div>
      <div className="button-admin">
        <Button
          onClick={() => format_new_data_to_save()}
          sx={{ fontSize: 20 }}
          endIcon={<SaveIcon sx={{ fontSize: 40 }} />}
        >
          Sauvegarder
        </Button>
      </div>
      <div className="field-container">
        <label className="label-detail"> Titre du projet</label>
        <TextField id="nom-projet" className="form-projet"></TextField>
        <label className="label-detail">Description du projet</label>
        <TextField
          id="description-projet"
          className="form-projet"
          multiline
        ></TextField>

        <label className="label-detail">Ville du projet</label>
        <TextField
          id="ville-projet"
          className="form-projet"
          multiline
        ></TextField>
      </div>
    </div>
  );
}
