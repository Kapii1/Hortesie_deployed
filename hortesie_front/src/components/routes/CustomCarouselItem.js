import { useState } from "react"
import Image from "./Image"

export default function CustomCarouselItem({ src, index, onAllLoad }) {

    return (<div>
        <Image src={src} load={onAllLoad} />
    </div>
    )
}