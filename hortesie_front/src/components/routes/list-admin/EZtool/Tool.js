import React, { useState } from "react";
import { API_URL } from "../../../../url";
import { Button } from "@mui/material";


export default function ImportFile({ setShouldReRender }) {
    const [file, setFile] = useState()
    const [description, setDescription] = useState("")

    const submit = async event => {
        event.preventDefault()
        const formData = new FormData()
        formData.append("file", file)
        const result = await fetch(
            API_URL + "/replace_template",
            {
                method: "POST",
                body: formData,
            }).then(res => console.log(res)).then(() => {
                setShouldReRender(item => !item)
            })
        // Send the file and description to the server
    }

    return (
        <form onSubmit={submit} encType="multipart/form-data">
            <label>Pour modifier la structure sur la gauche, vous pouvez envoyer un nouveau fichier</label>
            <input
                filename={file}
                onChange={e => setFile(e.target.files[0])}
                type="file"
                name="file"
                accept="*"
            ></input>
            <Button variant="contained" type="submit">Envoyer</Button>
        </form>
    )

}