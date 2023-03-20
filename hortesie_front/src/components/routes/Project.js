import React, { useEffect, useReducer, useRef, useState } from "react";
import "./Project.css";
import $ from 'jquery';
import Card from "@mui/material/Card";
import { AnimatePresence, motion } from "framer-motion";
import Grid from "@mui/material/Grid";
import { Routes, Route } from "react-router-dom";
import { Projet } from "./OneProject";
import { GridComponent } from "react-spring-animated-grid";
import { SpringGrid } from "react-stonecutter";
import Details from "./Details";
import { Link, useLocation } from "react-router-dom";
import { after } from "underscore";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { API_URL } from "../../url";
import { Helmet } from 'react-helmet-async';
import { Spinner } from "react-spinner-animated";
import { MDBIcon, MDBBtn } from "mdb-react-ui-kit";



export function Projets() {
  const location = useLocation();
  const initialState = {
    loading: true,
    error: '',
    items: [],
    visibleItems: []
  }
  const [isLoaded, setIsLoaded] = useState(false)

  const [state, dispatch] = useReducer(reducer, initialState)

  function reducer(state, action) {
    switch (action.type) {
      case 'FETCH_SUCCESS':
        return {
          loading: false,
          items: action.payload,
          error: '',
          visibleItems: action.payload,
        }
      case 'ORDER_BY_YEAR_ASC':
        return {
          ...state,
          visibleItems: state.items.sort((item1, item2) => item1.date - item2.date)
        }
      case 'ORDER_BY_YEAR_DESC':
        return {
          ...state,
          visibleItems: state.items.sort((item1, item2) => item2.date - item1.date)
        }
      case 'SEARCH':
        return {
          ...state,
          visibleItems: state.items.filter((item) => {
            console.log(item.nom)
            return (item.nom.toLowerCase().includes(action.searchAttr) | item.ville.toLowerCase().includes(action.searchAttr))
          })
        }
      default:
        return state
    }
  }
  const gridRef = useRef()
  const onLoad = after(state.items.length, () => {
    gridRef.current.className += " projets-container-loaded"
    setIsLoaded(true)
  });

  const fetchData = async () => {
    try {
      const res = await fetch(API_URL + "/projets", { method: "GET" });
      const json = await res.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: json })
      return json;
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {!isLoaded ? <div className="spinner-loading">
        <Spinner text={"Chargement..."} center={false} height={"100px"} />
      </div> : ''
      }

      < div className="Grid-container"
        id="grid-projet" >
        <div className="searching-container">
          <div className="input-search">
            <input onChange={(e) => {
              dispatch({ type: "SEARCH", searchAttr: e.target.value.toLocaleLowerCase() })
            }}></input>

            <MDBBtn onClick={() => { dispatch({ type: 'ORDER_BY_YEAR_ASC' }) }}><MDBIcon fas icon="sort-amount-up" /></MDBBtn>
            <MDBBtn onClick={() => { dispatch({ type: 'ORDER_BY_YEAR_DESC' }) }}><MDBIcon fas icon="sort-amount-down" /></MDBBtn>
          </div>

        </div>
        <Helmet>
          <title>{"Hortésie : Projets"}</title>
          <link rel="canonical" href={"https://hortesie.fr/projets"} />
        </Helmet>

        <Grid
          ref={gridRef}
          className="projets-container"
          id="projets-grid-container"
          container
          spacing={{ xs: 2, sm: 4, md: 6 }}
          columns={{ xs: 4, sm: 9, md: 11 }}
          justifyContent="center"
          alignItems="center"
        >
          {state.visibleItems &&
            state.visibleItems.map((item, i) => (
              <Grid className="projet" item xs={2} sm={4} md={2.5}>
                <Link to={item.id}>
                  <motion.div key={i}>
                    <Projet
                      i={i}
                      id={item.id}
                      nom_fr={item.nom}
                      path_image={item.vignette}
                      description={item.description}
                      onLoad={onLoad}
                    />
                  </motion.div>
                </Link>
              </Grid>
            ))}
        </Grid>
        <Routes location={location} key={location.key}>
          <Route path="/" />
          <Route path="/:id" element={<Details />} />
        </Routes>
      </div >
    </>
  );
}
