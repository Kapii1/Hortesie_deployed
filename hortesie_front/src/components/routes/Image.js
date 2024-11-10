import { useEffect, useState } from "react"
import 'react-spinner-animated/dist/index.css'
import { Spinner } from 'react-spinner-animated';
import "./Image.css"

export default function Image({ src, className, load, spinner = false }) {
    const [isLoaded, setIsLoaded] = useState(true)
    const imageLoaded = () => {
        setIsLoaded(true)
        load()
        console.log(isLoaded)
    }
    useEffect(() => {
        imageLoaded()
    }, [])
    
    return (
        <>
            {!isLoaded || spinner ?
                <div className="spinner-loading">
                    <Spinner text={"Chargement..."} center={false} height={"100px"} />
                </div> : ''}
            <img src={src} style={{ display: isLoaded ? "" : "none" }} className={className} onLoad={imageLoaded} />
        </>
    )
}