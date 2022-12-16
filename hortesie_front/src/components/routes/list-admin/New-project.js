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
export function New_Project(props) {
  const { onReRender } = props;
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
  const [imgs, setimgs] = useState([]);
  const [previewImage, setPreviewImage] = useState();
  const [vignette, setVignette] = useState();
  const [previewVignette, setPreviewVignette] = useState();
  const [file_vignette, setFileVignette] = useState();
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const [imageData, setImageData] = useState();

  const removeImage = (item) => {
    console.log(
      imgs.filter((file) => file.name !== item.name),
      item.name
    );
    setimgs(imgs.filter((file) => file !== item));
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
    const res = await fetch(API_URL + "/save_modif_project", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify(new_data),
    });

    let data2 = new FormData();
    data2.append("idProjet", id);
    for (let i = 0; i < imgs.length; i++) {
      data2.append("file", imgs[i]);
    }
    let res_2 = fetch(API_URL + "/add_image", {
      method: "POST",
      body: data2,
    }).then((res) => res.json());

    mod_vignette();
    onReRender();
    window.location.replace("https://hortesie.fr/admin/" + id);
    return new_data;
  };

  const imageHandler = async (event) => {
    event.preventDefault();
    const data2 = new FormData();
    const imgs_local = imgs ? imgs : [];
    const file_photo = [...event.target.files];
    setimgs((oldArray) => [].concat(oldArray, file_photo));
    // for (let i = 0; i < file_photo.length; i++) {
    //   setimgs((oldArray) => [...oldArray, file_photo[i]]);
    // }
    //   try {
    //     let res = fetch(API_URL + "/add_image", {
    //       method: "POST",
    //       body: data2,
    //     })
    //       .then((res) => res.json())
    //       .then((res) => {
    //         res.forEach((img) => {
    //           data.push({ nom: img });
    //           forceUpdate();
    //         });
    //       });
    //   } catch (error) {
    //     console.log("err", error);
    //   }
    // };
  };
  const mod_vignette = async () => {
    const data_to_send = new FormData();
    data_to_send.append("idProjet", id);
    data_to_send.append("file_vignette", vignette);
    let oo = await fetch(API_URL + "/add_vignette", {
      method: "POST",
      body: data_to_send,
    }).then((res) => res.text());
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
    return response_json;
  };
  useEffect(() => {
    if (!vignette) {
      setPreviewVignette(undefined);
      return;
    }
    const objectURL = URL.createObjectURL(vignette);
    setPreviewVignette(objectURL);
  }, [vignette]);

  useEffect(() => {
    if (!imgs) {
      setPreviewImage(undefined);
      return;
    }
    var prev = [];
    for (let i = 0; i < imgs.length; i++) {
      prev.push(URL.createObjectURL(imgs[i]));
    }
    setPreviewImage(prev);
  }, [imgs]);
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

        {/* <div className="image-admin-container">
          <div className="image-vignette">
            {vignette && (
              <img className="vignette-admin" src={previewVignette}></img>
            )}
            <input
              name="file_vignette"
              style={{ display: "none" }}
              accept="image/*"
              ref={hiddenFileInput}
              type="file"
              onChange={async (event) => {
                const vignette = event.target.files[0];
                if (vignette) {
                  setVignette(vignette);
                }
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
          {previewImage
            ? imgs.map((item, i) => {
                return (
                  <div key={i} className="image-container">
                    <img
                      key={i}
                      className="image-admin"
                      src={previewImage[i]}
                    />
                    <div className="delete-button-img">
                      <IconButton
                        backgroundColor="error"
                        onClick={() => {
                          return removeImage(imgs[i]);
                        }}
                      >
                        <DeleteIcon></DeleteIcon>
                      </IconButton>
                    </div>
                  </div>
                );
              })
            : undefined}
        </div> */}
      </div>
    </div>
  );
}
