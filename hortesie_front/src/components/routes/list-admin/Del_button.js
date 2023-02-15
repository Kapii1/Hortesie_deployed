import React, { useEffect, useState } from "react";
import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
} from 'mdb-react-ui-kit';
import DeleteIcon from "@mui/icons-material/Delete";
import { API_URL } from "../../../url";
import IconButton from "@mui/material/IconButton";



export default function Del_button(props) {

    const [reRender, setReRender] = useState(false);
    const [basicModal, setBasicModal] = useState(false);
    const delProjet = async (id) => {
        const res = await fetch(API_URL + "/del_projet", {
            method: "POST",
            body: JSON.stringify({ id: id }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        console.log("ended res", res);
        setReRender(!reRender);
        console.log("reeeer", reRender);
    };
    const toggleShow = () => setBasicModal(!basicModal);
    return (
        <IconButton
            onClick={() => {
                toggleShow()
            }}
        >
            <DeleteIcon></DeleteIcon>
            <MDBModal show={basicModal} setShow={setBasicModal} className="on-top" tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Êtes-vous sûr ?</MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                        </MDBModalHeader>

                        <MDBModalFooter>
                            <MDBBtn color='secondary' onClick={toggleShow}>
                                Fermer
                            </MDBBtn>
                            <MDBBtn onClick={() => {
                                console.log(props.item)
                                delProjet(props.item.id);
                                toggleShow();
                                props.reRender()
                            }}>Supprimer</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </IconButton>

    )
}