import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Routes, Route } from "react-router-dom";
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
import Del_button from "./Del_button"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ImportFile from "./EZtool/Tool";


function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update state to force render
  // An function that increment 👆🏻 the previous state like here
  // is better than directly setting `value + 1`
}
async function get_id_update_index(from_index, to_index) {

  const res = await fetch(API_URL + "/projects/switch/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "from": from_index, "to": to_index }),
  })
}

function change_index(id, to_index) {
  const res = fetch(API_URL + "/replace_index", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "id": id, "to_index": to_index }),
  })
}

export function ListProjectAdmin() {



  const [reRender, setReRender] = useState(false);

  const handleReRender = () => {
    setReRender(!reRender);
  };
  const location = useLocation();
  const [data, setData] = useState();
  const forceUpdate = useForceUpdate();
  async function fetchData() {
    fetch(API_URL + "/projects/", { method: "GET" })
      .then((response) => response.json())
      .then((responseJson) => {
        setData(responseJson);
      })
      .catch((error) => {
      });
  }
  const handleDrop = async (droppedItem) => {

    if (!droppedItem.destination) return;
    var updatedList = [...data];

    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    await get_id_update_index(droppedItem.source.index + 1, droppedItem.destination.index + 1)
    setData(updatedList)
  };


  useEffect(() => {
    fetchData();
  }, [reRender]);

  const delProjet = async (id) => {
    const res = await fetch(API_URL + `/projects/${id}/`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    fetchData();
    forceUpdate();

  };
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
            <div className="elem-title"> Ordre</div>
            <div className="elem-title"> Vignette</div>
            <div className="elem-title"> Nom Projet</div>
            <div className="elem-title"> Ville </div>
          </div>
          < DragDropContext onDragEnd={handleDrop}>
            <Droppable droppableId="list-container">
              {(provided) =>
                <div
                  className="list-container"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {data && data.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          className="item-container"
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                        >
                          <div className="del-row-container" key={item.id} >

                            <div className="del-button">
                              <Del_button item={item.id} delFunction={delProjet} reRender={handleReRender}></Del_button>
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
                                nom={item.name}
                                vignette={item.vignette}
                                ind={index}
                                ville={item.ville}
                                ordre={item.position}
                                key={item.id}
                              />
                            </Link>

                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              }
            </Droppable>
          </DragDropContext>
        </div>

        <Routes location={location} key={location.key}>
          <Route path="/" />
          <Route
            path="/:id"
            element={<DetailAdmin onReRender={handleReRender} />}
          />
          <Route
            path="/new_project"
            element={<New_Project onReRender={handleReRender} />}
          />
        </Routes>
      </div>
    </div>
  );
}
