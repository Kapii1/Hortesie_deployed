import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import { Store } from "react-notifications-component";
import useAPI from "./apiService";
import useSWR from "swr";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import Input from "antd/es/input";
import 'antd/es/input/style'; 
import Form from "antd/es/form";
import 'antd/es/form/style'; 
import DatePicker from "antd/es/date-picker";
import 'antd/es/date-picker/style'; 
import { API_URL } from "../../../url";
import Del_button from "./Del_button";
import Dndbutton from "./Dndbutton";
import TextEditor from "./TextEditor";
import SegmentedControl from "./SegmentedControl";
import "./Detailadmin.css";

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

export function ProjectDetailPage() {
  const navigate = useNavigate();
  const [data, updateItems] = useState();
  let { id } = useParams();
  const forceUpdate = useForceUpdate();
  const [vignette, setLocalVignette] = useState();
  const [vignetteHasChanged, setVignetteHasChanged] = useState();
  const [editorValue, setEditorValue] = useState();

  const handleEditorChange = (value) => {
    setEditorValue(value);
  };
  
  const options = ["projet", "etude"];
  const [selectedOption, setSelectedOption] = useState();
  const { getProjectImages, deletePhoto, setVignette } = useAPI();
  
  const {
    data: images,
    error: imagesError,
    mutate,
  } = useSWR(`/api/projects/${id}/images/`, () => getProjectImages(id));
  
  const removeImage = (nom_img) => {
    deletePhoto(nom_img);
  };
  
  const [form] = useForm();

  const format_new_data_to_save = () => {
    const userName = form.getFieldValue("name");
    const city = form.getFieldValue("city");
    const annee = form.getFieldValue("annee");
    
    const res = fetch(API_URL + "/projects/" + data.id + "/", {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userName,
        description: editorValue,
        type: selectedOption,
        city: city,
        date: annee.format("YYYY-MM-DD"),
      }),
    }).then((res) => {
      if (res.status === 200) {
        Store.addNotification({
          title: "Sauvegardé",
          message: "Les modifications ont bien été enregistrées.",
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
      }
    });

    return { msg: "ok" };
  };
  
  const handleSelect = (option) => {
    setSelectedOption(option);
  };
  
  const updateVignetteonDB = async (idProjet, id_vignette) => {
    setVignette(idProjet, id_vignette)
      .then((res) => {
        return res.data;
      })
      .then((res) => {
        setVignetteHasChanged(!vignetteHasChanged);
        setLocalVignette(res.vignette);
      });
  };
  
  const imageHandler = async (file) => {
    Store.addNotification({
      title: "Vos images sont en cours d'envoi",
      message: "Veuillez patienter vos images s'envoient.",
      type: "default",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    });
    
    const data2 = new FormData();
    data2.append("idProjet", id);
    const file_photo = file;

    for (let i = 0; i < file_photo.length; i++) {
      data2.append("file", file_photo[i]);
    }

    try {
      let res = fetch(API_URL + `/projects/${id}/add_image/`, {
        method: "POST",
        body: data2,
      })
        .then((res) => {
          if (res.status === 200) {
            Store.addNotification({
              title: "Parfait !",
              message: "Les images ont bien été transmises !",
              type: "success",
              insert: "top",
              container: "top-right",
              animationIn: ["animate__animated", "animate__fadeIn"],
              animationOut: ["animate__animated", "animate__fadeOut"],
              dismiss: {
                duration: 5000,
                onScreen: true,
              },
            });
            return res.json();
          } else {
            Store.addNotification({
              title: "Erreur !",
              message: "Une erreur s'est produite...",
              type: "danger",
              insert: "top",
              container: "top-right",
              animationIn: ["animate__animated", "animate__fadeIn"],
              animationOut: ["animate__animated", "animate__fadeOut"],
              dismiss: {
                duration: 5000,
                onScreen: true,
              },
            });
            return "error";
          }
        })
        .then((res) => {
          if (res != "error") {
            res.forEach((img) => {
              data.push({ nom: img });
            });
          }
          mutate();
        });
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(API_URL + `/projects/${id}/`, {
        method: "GET",
      });
      const json = await res.json();
      setEditorValue(json.description);
      setSelectedOption(json.type);
      updateItems(json);
    };

    fetchData();
  }, [vignetteHasChanged]);

  const handleBackToList = () => {
    navigate('/admin/projets');
  };

  return (
    <div className="Detail-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Button
          onClick={handleBackToList}
          sx={{ fontSize: 16, marginRight: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          Retour à la liste
        </Button>
        <label className="titre-modif">Modification du projet</label>
      </div>

      <div className="button-admin">
        <Button
          onClick={() => {
            format_new_data_to_save();
          }}
          sx={{ fontSize: 20 }}
          endIcon={<SaveIcon sx={{ fontSize: 40 }} />}
        >
          Sauvegarder
        </Button>
      </div>
      
      {data && (
        <div className="field-container">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              name: data.name,
              description: data.description,
              type: data.type,
              city: data.city,
              annee: dayjs(data.date),
            }}
          >
            <Form.Item name="name" label="Titre du projet">
              <Input
                id="nom-projet"
                className="form-projet"
                defaultValue={data.name}
              />
            </Form.Item>

            <Form.Item name="annee" label="Année de réalisation du projet">
              <DatePicker placeholder="Sélectionnez une année" picker="year" />
            </Form.Item>
            
            <Form.Item name="description" label="Description du projet">
              <TextEditor
                placeholder="Commencez à écrire..."
                value={editorValue}
                onChange={handleEditorChange}
                id="description-projet"
              />
            </Form.Item>
            
            <Form.Item name="city" label="Ville du projet">
              <Input
                id="ville-projet"
                className="form-projet"
                defaultValue={data.city}
              />
            </Form.Item>
            
            <Form.Item name="type" label="Projet ou Étude">
              <SegmentedControl
                options={options}
                selectedOption={selectedOption}
                onSelect={handleSelect}
              />
            </Form.Item>
          </Form>
          
          <div className="image-admin-container">
            <div className="add-photo-button">
              <Dndbutton handleClick_photo={imageHandler} />
            </div>
            <div className="header-admin-container">
              <th className="header-admin">Vignette</th>
              <th className="header-admin">Supprimer</th>
              <th className="header-admin">Photo</th>
            </div>
            {images &&
              images?.map((image, i) => {
                return (
                  <div key={i} className="image-container">
                    <div className="checkbox-vignette-container">
                      <input
                        type="checkbox"
                        className="checkbox-vignette"
                        readOnly
                        checked={"/api" + image.file === data.vignette}
                        onClick={(event) => {
                          if ("/api" + image.file === data.vignette) return;
                          updateVignetteonDB(data.id, image.id);
                        }}
                      />
                      <div className="project-name">{image.nom}</div>
                    </div>

                    <div className="delete-button-img">
                      <Del_button
                        item={image.id}
                        delFunction={removeImage}
                        reRender={mutate}
                      />
                    </div>

                    <div className="image-container-delete">
                      <img className="image-admin" src={"/api" + image.file} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}