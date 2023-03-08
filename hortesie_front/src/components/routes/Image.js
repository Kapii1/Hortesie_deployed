import { useState } from "react"
import 'react-spinner-animated/dist/index.css'
import { Spinner } from 'react-spinner-animated';
import "./Image.css"

export default function Image({ src, className, load, spinner = false }) {
    const [isLoaded, setIsLoaded] = useState(false)
    const imageLoaded = () => {
        setIsLoaded(true)
        load()
        console.log(isLoaded)
    }
    return (
        <>
            {!isLoaded || spinner ?
                <div className="spinner-loading">
                    <Spinner text={"Chargement..."} bgColor={"#FFF"} center={false} height={"100px"} />
                </div> : ''}
            {/* <img src={src} style={{ display: isLoaded ? "" : "none" }} className={className} onLoad={imageLoaded} /> */}
        </>
    )
}