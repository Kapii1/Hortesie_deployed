import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import NewProject from "./New-project.css";
import ImageList from "@mui/material/ImageList";

import SaveIcon from "@mui/icons-material/Save";
import ImageListItem from "@mui/material/ImageListItem";
import { Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// Import toastify css file

// toast-configuration method,
// it is compulsory method.
import { v4 as uuidv4 } from "uuid";
import { API_URL } from "../../../url";
function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update state to force render
  // An function that increment 👆🏻 the previous state like here
  // is better than directly setting `value + 1`
}
export function New_Project() {
  const [data, updateItems] = useState();
  const [loading, setLoading] = useState();
  const [isDone, setDone] = useState();
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  const id = s4() + s4() + s4();

  const forceUpdate = useForceUpdate();
  var imgs = [];
  const [vignette, setVignette] = useState();
  const [file_vignette, setFileVignette] = useState();
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");

  const removeImage = (nom_img) => {
    var index;
    data.forEach((element, i) => {
      if (element.nom == nom_img) {
        index = i;
      }
    });

    data.splice(index, 1);
    let idPhoto = nom_img.split(".")[0];
    idPhoto = idPhoto.split("/");
    let realidPhoto = idPhoto[idPhoto.length - 1];
    var nomimg = { id: realidPhoto, img: nom_img };
    fetch(API_URL + "/del_image", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nomimg),
    });
    forceUpdate();
  };

  const format_new_data_to_save = async (bru) => {
    const creation = await create_project();
    console.log("created");
    var new_data = [];
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + "/" + mm + "/" + yyyy;

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
    console.log("ezaezazaeeaz " + new_data);
    const res = await fetch(API_URL + "/save_modif_project", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify(new_data),
    });

    console.log("post toast");

    window.location.replace("http://localhost:3000/#/admin/" + id);
    return new_data;
  };

  const imageHandler = async (event) => {
    event.preventDefault();
    const data2 = new FormData();
    data2.append("idProjet", id);
    const file_photo = event.target.files;

    for (let i = 0; i < file_photo.length; i++) {
      data2.append("file", file_photo[i]);
    }

    try {
      let res = fetch(API_URL + "/add_image", {
        method: "POST",
        body: data2,
      })
        .then((res) => res.json())
        .then((res) => {
          res.forEach((img) => {
            data.push({ nom: img });
            forceUpdate();
          });
        });
    } catch (error) {
      console.log("err", error);
    }
  };
  const mod_vignette = async (event) => {
    event.preventDefault();
    const data_to_send = new FormData();
    console.log("file ving", file_vignette, event.target.files[0]);
    data_to_send.append("idProjet", id);
    data_to_send.append("file_vignette", event.target.files[0]);
    let oo = await fetch(API_URL + "/add_vignette", {
      method: "POST",
      body: data_to_send,
    })
      .then((res) => res.text())
      .then((res) => {
        setVignette(res.replace("../hortesie_front/public/", ""));
      });
  };
  const hiddenFileInput = React.useRef(null);
  const hiddenFileInput_photos = React.useRef(null);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleClick_photo = (event) => {
    hiddenFileInput_photos.current.click();
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
    console.log(response_json);
    return response_json;
  };
  useEffect(() => {}, []);

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

        <div className="image-admin-container">
          <div className="image-vignette">
          {vignette && <img
              className="vignette-admin"
              src={ process.env.PUBLIC_URL + "/" + vignette}
            ></img>}
            <input
              name="file_vignette"
              style={{ display: "none" }}
              accept="image/*"
              ref={hiddenFileInput}
              type="file"
              onChange={async (event) => {
                const setving = async () => {
                  const vignette = event.target.files[0];
                };

                if (vignette) {
                  setFileVignette(event.target.files[0]);
                  mod_vignette(event);
                } else {
                  setTimeout(setving, 300);
                }
                setving();
              }}
            ></input>
            <Button
              type="button"
              className="change-vignette"
              onClick={handleClick}
            >
              Ajouter une vignette
            </Button>
          </div>
          <div className="add-photo-button">
            <input
              multiple
              name="file"
              style={{ display: "none" }}
              accept="image/*"
              ref={hiddenFileInput_photos}
              type="file"
              onChange={(event) => {
                const file = event.target.files;
                console.log("all file", file);
                setFile(file);
                imageHandler(event);
              }}
            />
            <Button
              endIcon={<AddIcon></AddIcon>}
              type="button"
              onClick={handleClick_photo}
            >
              Ajouter des photos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
