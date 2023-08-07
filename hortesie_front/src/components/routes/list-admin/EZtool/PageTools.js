import React, { useEffect, useState } from "react";
import ImportFile from "./Tool";
import useToken from "../useToken";
import Login from "../Login";
import './PageTools.css'
import { Button } from "@mui/material";
import Loader from "../Loader";
import { API_URL } from "../../../../url";


const IndentedLabel = ({ label, depth, className }) => {
    const indentation = `${depth * 30}px`; // You can adjust the indentation size as needed

    const style = {
        paddingLeft: indentation,
        textAlign: "start",
    };

    return <div style={style}>{label}</div>;
};



export default function Toolpage() {
    const [structure, setStructure] = useState()
    const [unChecked, setUnChecked] = useState([])
    const [Loading, setLoading] = useState(false)
    const [downloadAsked, setDownloadAsked] = useState(false)
    const [shouldReRender, setShouldReRender] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handleClickFile = () => {
        const filename = "FICHER_CCTP"
        setLoading(true)
        setDownloadAsked(true)
        fetch("https://hortesie.fr:445/cctp_file/", {
            method: "POST",
            body: JSON.stringify({ values: unChecked, filename: filename }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }).then(res => res.blob())
            .then(res => forceDownload(res, filename))
    }
    const forceDownload = (response, filename) => {
        const url = window.URL.createObjectURL(new Blob([response]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${filename}.docx`)
        document.body.appendChild(link)
        link.click()
        setLoading(false)
        setTimeout(() => {
            setDownloadAsked(false)
        }, 2000)
    }
    useEffect(() => {
        setIsLoading(true)
        const res = fetch("https://hortesie.fr:445/cctp_file/", {
            method: "GET"
        }).then(res => {
            return res.json()
        }).then(res => {
            parseStructure(res)
            setIsLoading(false)
        })
    }, [shouldReRender])
    const { token, setToken } = useToken();

    const updateChildrenChecked = (dataArray, index, isChecked) => {
        const item = dataArray[index];

        // Update isChecked for the current item
        item.isChecked = isChecked;

        // If the item has children (with a higher depth value), recursively update their isChecked
        for (let i = index + 1; i < dataArray.length; i++) {
            if (dataArray[i].depth <= item.depth) {
                break; // We've reached the end of the children for this item
            }
            dataArray[i].isChecked = isChecked;
        }
    };
    const updateChildrenDisplayed = (dataArray, index, isDisplayed) => {
        const item = dataArray[index];


        // If the item has children (with a higher depth value), recursively update their isChildDisplayed
        for (let i = index + 1; i < dataArray.length; i++) {
            if (dataArray[i].depth <= item.depth) {
                break; // We've reached the end of the children for this item
            }
            dataArray[i].isDisplayed = isDisplayed;
        }
        return (dataArray)
    };
    const handleCheck = (index) => (event) => {
        const isChecked = event.target.checked;
        const checkdata = [...structure];
        updateChildrenChecked(checkdata, index, !structure[index].isChecked);
        setUnChecked(structure.filter((item) => !item.isChecked)
            .map(({ title, content }) => ({ title, content })))
        const updatedData = structure.map((item) =>
            item.uid === structure[index].uid ? { ...item, isChecked: event.target.checked } : item
        );
        setStructure(updatedData)
    };

    const handleCollapse = (index) => (event) => {
        console.log(structure[index].title)
        const isChildDisplayed = true
        const checkdata = [...structure];
        const updatedData = updateChildrenDisplayed(checkdata, index, !structure[index + 1].isDisplayed);
        setStructure(updatedData)
    }

    const parseStructure = (structure) => {
        setStructure(structure.map((item, index) => {
            if (index === structure.length) {
                return item
            }
            if (structure[index + 1] && item.depth < structure[index + 1].depth) {
                item.isChildDisplayed = true
            }
            return item
        }))

    }

    useEffect(() => {
        fetch(API_URL + "/welcome_admin", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: token }),
        })
            .then((res) => res.text())
            .then((res) => {
                if (res == "not good") {
                    setToken(false);
                }
            });
    });

    if (!token) {
        return <Login setToken={setToken} />;
    }
    return (<div className="tool-container">
        <div className="list-title">
            {isLoading && <Loader loading={isLoading}></Loader>}
            {structure && structure.map((item, index) => {
                return (
                    <div className="one-checkbox-item" key={item.title}>
                        {item.isDisplayed && item.isChildDisplayed ? (<div onClick={handleCollapse(index)} className="collapsing-button">
                            {(structure[index + 1].isDisplayed) ?
                                <>-</> : <>+</>}
                        </div>) : <span></span>}
                        {item.isDisplayed && <>
                            <input className="checkbox-input" type="checkbox" onChange={handleCheck(index)} checked={item.isChecked}></input>
                            <IndentedLabel label={item.title} depth={item.depth} className="labels-indented" /></>}
                    </div>)
            })}
        </div>

        <div className="tool-control">
            <Button variant="contained" onClick={handleClickFile}>Générer le fichier</Button>
            <ImportFile setShouldReRender={setShouldReRender}></ImportFile>
            {downloadAsked && <Loader loading={Loading}></Loader>}
        </div>
    </div>)
}