import React from "react"
import { Button } from "@mui/material"
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Dropzone from "react-dropzone";
import { useDrag } from 'react-dnd'
import "./Detailadmin.css"

function onDrop(acceptedFiles) {
    console.log(acceptedFiles)
    acceptedFiles.forEach(file => {
        console.log(file)
    })
}

export default function Dndbutton({ handleClick_photo }) {

    return (
        <Dropzone onDrop={handleClick_photo}>
            {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                    <input  {...getInputProps()} />
                    <p className="input-drag-n-drop" > <CloudUploadIcon /> Glissez et déposez vos fichiers</p>
                </div>
            )}
        </Dropzone>
    )
}