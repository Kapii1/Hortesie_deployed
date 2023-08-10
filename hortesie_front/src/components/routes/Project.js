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
import { Helmet } from 'react-helmet-async';
import { Spinner } from "react-spinner-animated";
import { MDBIcon, MDBBtn } from "mdb-react-ui-kit";
import CustomGrid from "./CustomGrid";
import { CustomGridItem } from "./CustomGridItem";

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_EXPAND_SEARCH':
      return {
        ...state,
        isExpanded: !state.isExpanded
      }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        items: action.payload,
        error: '',
        visibleItems: action.payload
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
          return (item.nom.toLowerCase().includes(action.searchAttr) | item.ville.toLowerCase().includes(action.searchAttr))
        })
      }
    case 'PROJECTS':
      return {
        ...state,
        visibleItems: state.items.filter(
          (item) => item.type === "projet"
        )
      }
    case 'ETUDES':
      return {
        ...state,
        visibleItems: state.items.filter(
          (item) => item.type === "etude"
        )
      }
    default:
      return state
  }
}

export function Projets({ filter }) {
  const location = useLocation();
  const initialState = {
    loading: true,
    error: '',
    items: [],
    visibleItems: [],
    isExpanded: false
  }
  const [isLoaded, setIsLoaded] = useState(true)

  const [state, dispatch] = useReducer(reducer, initialState)
  const expander = useRef()
  const searchbar = useRef()


  const gridRef = useRef()
  const onLoad = after(state.visibleItems.length, () => {
    setIsLoaded(true)
    gridRef.current.className += " projets-container-loaded"
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

  useEffect(() => {
    if (state.isExpanded) {
      expander.current.style.transform = "none"
    } else if (window.innerWidth < 800) {
      expander.current.style.transform = "translate(80%)"
    } else {
      expander.current.style.transform = "translate(86%)"
    }
    console.log(state)
  }, [state.isExpanded])
  console.log(state)

  useEffect(() => {

    if (filter === 'projets') {
      console.log("in projetcs")
      dispatch({ type: 'PROJECTS' })
    } else if (filter === 'etudes') {
      console.log("in studies")
      dispatch({ type: 'ETUDES' })
    }
  }, [location])
  return (
    <>
      {!isLoaded ? <div className="spinner-loading">
        <Spinner text={"Chargement..."} center={false} height={"100px"} />
      </div> : ''
      }

      < div className="Grid-container"
        id="grid-projet" >
        <div className="searching-container" ref={expander}>
          <div className="expander-search" onClick={() => {
            if (!state.isExpanded) { searchbar.current.focus() }
            dispatch({ type: 'TOGGLE_EXPAND_SEARCH' })
          }}>
            <MDBIcon fas icon={!state.isExpanded ? "search" : "angle-right"} size="2x" />
          </div>
          <div className="input-search">
            <input ref={searchbar} onChange={(e) => {
              dispatch({ type: "SEARCH", searchAttr: e.target.value.toLocaleLowerCase() })
            }}></input>

            <MDBBtn className='btn-float' floating onClick={() => { dispatch({ type: 'ORDER_BY_YEAR_ASC' }) }}><MDBIcon fas icon="sort-amount-up" /></MDBBtn>
            <MDBBtn className='btn-float' floating onClick={() => { dispatch({ type: 'ORDER_BY_YEAR_DESC' }) }}><MDBIcon fas icon="sort-amount-down" /></MDBBtn>
            <div className="btn-container">
              <MDBBtn onClick={() => { dispatch({ type: 'PROJECTS' }) }}>Projets</MDBBtn>
              <MDBBtn onClick={() => { dispatch({ type: 'ETUDES' }) }}>Etudes</MDBBtn>
            </div>
          </div>

        </div>
        <Helmet>
          <title>{"Hortésie : Projets"}</title>
          <link rel="canonical" href={"https://hortesie.fr/projets"} />
        </Helmet>


        <CustomGrid
          ref={gridRef}
          className="projets-container">
          {state.visibleItems &&
            state.visibleItems.map((item, i) => (
              <CustomGridItem className="projet" >
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
              </CustomGridItem>
            ))}

        </CustomGrid>


        <Routes location={location} key={location.key}>
          <Route path="/" />
          <Route path="/:id" element={<Details />} />
        </Routes>
      </div >
    </>
  );
}
