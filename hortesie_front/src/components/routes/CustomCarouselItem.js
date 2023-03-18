import { useState } from "react"
import Image from "./Image"
import './CustomCarouselItem.css'
export default function CustomCarouselItem({ src, index, onAllLoad }) {

    return (<div>
        <Image src={src} load={onAllLoad} className="carousel-images" />
    </div>
    )
}