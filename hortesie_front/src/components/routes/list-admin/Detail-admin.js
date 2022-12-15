import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import Detailadmin from "./Detailadmin.css";
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
export function DetailAdmin(props) {
  const { onReRender } = props;
  const [data, updateItems] = useState();
  const [loading, setLoading] = useState();
  const [isDone, setDone] = useState();
  let { id } = useParams();
  const forceUpdate = useForceUpdate();
  var imgs = [];
  const [vignette, setVignette] = useState();
  const [file_vignette, setFileVignette] = useState();
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const [vignetteHasChanged, setVignetteHasChanged] = useState();
  const removeImage = (nom_img) => {
    var index;
    if (!nom_img) return;

    data.forEach((element, i) => {
      if (element.nom == nom_img) {
        index = i;
      }
    });
    data.splice(index, 1);
    let idPhoto = nom_img.split("/").slice(-1)[0];
    var nomimg = { id: idPhoto, img: nom_img };
    console.log(nomimg);
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
    var new_data = [];
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + "/" + mm + "/" + yyyy;
    const nom_projet = document.getElementById("nom-projet").value;
    const description = document.getElementById("description-projet").value;
    const ville = document.getElementById("ville-projet").value;
    const annee = document.getElementById("annee-projet").value;
    var list_of_img = [];
    data.forEach((element, i) => {
      if (i != 0) {
        list_of_img.push(element.nom);
      }
    });
    new_data = await {
      id: data[0].id,
      nom: nom_projet,
      description: description,
      date: today,
      type: "projet",
      vignette: data[0].vignette,
      ville: ville,
      images: list_of_img,
      annee: annee,
    };

    const res = await fetch(API_URL + "/save_modif_project", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify(new_data),
    });

    console.log("post toast");
    return new_data;
  };
  const updateVignetteonDB = async (path_vignette, idProjet) => {
    var new_data = [];
    new_data = await {
      idProjet: idProjet,
      path_vignette: path_vignette,
    };
    console.log(new_data);
    const res = await fetch(API_URL + "/set_vignette", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify(new_data),
    });
    onReRender();
    setVignetteHasChanged(!vignetteHasChanged);
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
      console.log("before fetch in img handler " + data2);
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
      console.log("Error : ", error);
    }
  };
  const mod_vignette = async (event) => {
    const data_to_send = new FormData();
    data_to_send.append("idProjet", id);
    data_to_send.append("file_vignette", event.target.files[0]);
    let oo = await fetch(API_URL + "/add_vignette", {
      method: "POST",
      body: data_to_send,
    })
      .then((res) => res.text())
      .then((res) => setVignetteHasChanged(!vignetteHasChanged));
  };
  const hiddenFileInput = React.useRef(null);
  const hiddenFileInput_photos = React.useRef(null);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleClick_photo = (event) => {
    hiddenFileInput_photos.current.click();
  };

  const change_vignette = () => {};
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(API_URL + "/projets/" + id, {
        method: "GET",
      });
      const json = await res.json();
      setVignette(json[0].vignette);
      updateItems(json);
    };

    fetchData();
  }, [vignetteHasChanged]);

  return (
    <div className="Detail-container">
      <label className="titre-modif">Modification du projet</label>

      <div className="button-admin">
        <Button
          onClick={() => format_new_data_to_save()}
          sx={{ fontSize: 20 }}
          endIcon={<SaveIcon sx={{ fontSize: 40 }} />}
        >
          Sauvegarder
        </Button>
      </div>
      {data && (
        <div className="field-container">
          <label className="label-detail"> Titre du projet</label>
          <TextField
            id="nom-projet"
            className="form-projet"
            defaultValue={data[0].nom}
          ></TextField>
          <label className="label-detail">Année de réalisation du projet</label>
          <TextField
            id="annee-projet"
            className="form-projet"
            defaultValue={data[0].annee}
          ></TextField>
          <label className="label-detail">Description du projet</label>
          <TextField
            id="description-projet"
            className="form-projet"
            defaultValue={data[0].description}
            multiline
          ></TextField>

          <label className="label-detail">Ville du projet</label>
          <TextField
            id="ville-projet"
            className="form-projet"
            defaultValue={data[0].ville}
            multiline
          ></TextField>

          <div className="image-admin-container">
            <div className="image-vignette">
              <img className="vignette-admin" src={vignette}></img>
              <input
                name="file_vignette"
                style={{ display: "none" }}
                accept="image/*"
                ref={hiddenFileInput}
                type="file"
                onChange={async (event) => {
                  if (event.target.files[0]) {
                    mod_vignette(event);
                  }
                }}
              ></input>
              <Button
                type="button"
                className="change-vignette"
                onClick={handleClick}
              >
                Changer la vignette
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
            {data.map((elem, i) => {
              if (i != 0 && elem.nom !== "") {
                console.log(elem);
                return (
                  <div key={i} className="image-container">
                    <div>
                      Is vignette :
                      <input
                        type="checkbox"
                        defaultChecked={data[0].vignette
                          .split("/")
                          .slice(-1)[0]
                          .includes(elem.nom.split("/").slice(-1)[0])}
                        checked={data[0].vignette
                          .split("/")
                          .slice(-1)[0]
                          .includes(elem.nom.split("/").slice(-1)[0])}
                        onClick={(event) => {
                          updateVignetteonDB(
                            process.env.PUBLIC_URL + "/" + elem.nom,
                            data[0].id
                          );
                        }}
                      />
                    </div>
                    <img className="image-admin" src={elem.nom} />
                    <div className="delete-button-img">
                      <IconButton
                        backgroundColor="error"
                        onClick={() => removeImage(elem.nom)}
                      >
                        <DeleteIcon></DeleteIcon>
                      </IconButton>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
}
