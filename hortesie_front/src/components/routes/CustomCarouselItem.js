import { useState } from "react"
import Image from "./Image"
import './CustomCarouselItem.css'
export default function CustomCarouselItem({ src, index, onAllLoad }) {

    return (<div className="carousel-item-container">
        <Image src={src} load={onAllLoad} className="carousel-images" />
    </div>
    )
}