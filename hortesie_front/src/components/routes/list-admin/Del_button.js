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
    const [basicModal, setBasicModal] = useState(false);
    const delFunction = props.delFunction

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
                                delFunction(props.item);
                                toggleShow();
                            }}>Supprimer</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </IconButton>

    )
}