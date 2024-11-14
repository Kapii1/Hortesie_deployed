import React, { useEffect, useReducer, useRef, useState } from "react";
import "./Project.css";
import { AnimatePresence, motion } from "framer-motion";
import Grid from "@mui/material/Grid";
import { Routes, Route, json } from "react-router-dom";
import { Projet } from "./OneProject";
import Details from "./Details";
import { Link, useLocation } from "react-router-dom";
import { after } from "underscore";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { API_URL } from "../../url";
import { Helmet } from "react-helmet-async";
import { Spinner } from "react-spinner-animated";
import CustomGrid from "./CustomGrid";
import { CustomGridItem } from "./CustomGridItem";

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_EXPAND_SEARCH":
      return {
        ...state,
        isExpanded: !state.isExpanded,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        items: action.payload,
        error: "",
        visibleItems: action.payload,
      };
    case "ORDER_BY_YEAR_ASC":
      return {
        ...state,
        visibleItems: state.items.sort(
          (item1, item2) => item1.date - item2.date
        ),
      };
    case "ORDER_BY_YEAR_DESC":
      return {
        ...state,
        visibleItems: state.items.sort(
          (item1, item2) => item2.date - item1.date
        ),
      };
    case "SEARCH":
      return {
        ...state,
        visibleItems: state.items.filter((item) => {
          return (
            item.nom.toLowerCase().includes(action.searchAttr) |
            item.ville.toLowerCase().includes(action.searchAttr)
          );
        }),
      };
    case "PROJECTS":
      return {
        ...state,
        visibleItems: state.items.filter((item) => item.type === "projet"),
      };
    case "ETUDES":
      return {
        ...state,
        visibleItems: state.items.filter((item) => item.type === "etude"),
      };
    default:
      return state;
  }
}

export function Projets({ filter }) {
  const location = useLocation();
  const initialState = {
    loading: true,
    error: "",
    items: [],
    visibleItems: [],
    isExpanded: false,
  };
  const [isLoaded, setIsLoaded] = useState(true);

  const [state, dispatch] = useReducer(reducer, initialState);
  const expander = useRef();
  const searchbar = useRef();

  const gridRef = useRef();
  const onLoad = after(state.visibleItems.length, () => {
    setIsLoaded(true);
    gridRef.current.className += " projets-container-loaded";
  });

  const fetchData = async () => {
    try {
      const res = await fetch(API_URL + "/projects/", { method: "GET" });
      const json = await res.json();
      dispatch({ type: "FETCH_SUCCESS", payload: json });
      gridRef.current.className += " projets-container-loaded";
      return json;
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (filter === "projets") {
      dispatch({ type: "PROJECTS" });
    } else if (filter === "etudes") {
      dispatch({ type: "ETUDES" });
    }
  }, [location]);
  return (
    <>
      {!isLoaded ? (
        <div className="spinner-loading">
          <Spinner text={"Chargement..."} center={false} height={"100px"} />
        </div>
      ) : (
        ""
      )}

      <div className="Grid-container" id="grid-projet">
        <Helmet>
          <title>{"Hortésie : Projets"}</title>
          <link rel="canonical" href={"https://hortesie.fr/projets"} />
        </Helmet>

        <CustomGrid
          ref={gridRef}
          className="projets-container projets-container-loaded"
        >
          {state.visibleItems &&
            state.visibleItems.map((item, i) => (
              <CustomGridItem className="projet">
                <Link to={item.id}>
                  <motion.div key={i}>
                    <Projet
                      i={i}
                      id={item.id}
                      name={item.name}
                      path_image={item.vignette}
                      description={item.description}
                      onLoad={onLoad}
                    />
                  </motion.div>
                </Link>
              </CustomGridItem>
            ))}
        </CustomGrid>

        <Routes location={location} key={location.key}>
          <Route path="/" />
          <Route path="/:id" element={<Details />} />
        </Routes>
      </div>
    </>
  );
}
