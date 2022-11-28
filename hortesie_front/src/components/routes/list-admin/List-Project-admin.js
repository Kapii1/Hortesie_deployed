import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import AddIcon from '@mui/icons-material/Add';
import { Routes, Route } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ListProject from './ListProject.css';
import { OneRowAdmin } from "./OneRow";
import DeleteIcon from '@mui/icons-material/Delete';
import { DetailAdmin } from "./Detail-admin";
import Save from "@mui/icons-material/Save";
import { Button, Icon } from "@mui/material";
import Login from "./Login";

import useToken from './useToken';
import { New_Project } from "./New-project";
function useFetchData() {
    const [data, setData] = useState()

    const [loading, setLoading] = useState();
    useEffect(() => {
        setLoading(true)
        fetch("http://localhost:3001/projets", { method: "GET" })
            .then((response) => response.json())
            .then((responseJson) => {
                setData(responseJson);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    return ({ loading, data })
}

function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
    // An function that increment 👆🏻 the previous state like here 
    // is better than directly setting `value + 1`
  }

export function ListProjectAdmin() {
    const [reRender, setReRender] = useState(false);  
  
    const delProjet = async (id)=>{
        const res = await fetch("http://localhost:3001/del_projet", {
            method:"POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({id:id})
        })
        forceUpdate()
    
    }
    const handleReRender = () => {    
     setReRender(!reRender); // state change will re-render parent      
    }; 
    const location = useLocation();
    const { loading, data } = useFetchData()
    
    const { token, setToken } = useToken();
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    console.log("token",token)
    useEffect(()=>{
        fetch("http://localhost:3001/welcome_admin", {
            method:"POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body:JSON.stringify({token:token})
        })
        .then((res)=>res.text())
        .then((res) =>{
            if (res=="not good"){
                setToken(false)
            }
        })
    })
    if(!token) {
        return <Login setToken={setToken} />
    }

    return (
        <div className="all-admin-container">
            <div className="admin-button-container">
                <div className="button-admin add-project-admin">
                    <Link style={{ textDecoration: 'none', color: 'black' }} to="new_project">
                    <Button sx={{ fontSize: 20 }} startIcon={<AddIcon />} >
                        Ajouter projet
                    </Button>
                    </Link>
                </div>
                
            </div>
            <div className="admin-list-container">

                <div className="admin-list">
                    <div className="one-row-header">
                        <div className="supp-title"><DeleteIcon/></div>
                        <div className="elem-title"> Vignette</div>
                        <div className="elem-title"> Nom Projet</div>
                        <div className="elem-title"> Ville </div>
                    </div>

                    {data && data.map((item, i) => {
                        console.log("item", item.nom)
                        return (
                            <div className="del-row-container">
                            <div className="del-button">
                            <IconButton onClick={()=> {delProjet(item.id)
                            forceUpdate()}}><DeleteIcon></DeleteIcon></IconButton>
                            </div>
                            <Link style={{ textDecoration: 'none', color: 'black' ,width:"95%"}} to={item.id}>
                                
                                <OneRowAdmin nom={item.nom} vignette={item.vignette} ind={i} ville={item.ville} key={i} />
                            </Link>
                            </div>)
                    })}
                </div>

                <Routes location={location} key={location.key}>
                    <Route path="/" />
                    <Route path="/:id" element={<DetailAdmin  onReRender={handleReRender}  />} />
                    <Route path="/new_project" element={<New_Project/>}/>
                </Routes>
            </div>
        </div>)
}