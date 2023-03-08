import { useState } from "react"
import Image from "./Image"

export default function CustomCarouselItem({ src, index, onAllLoad }) {

    return (<>
        <Image src={src} load={onAllLoad} />
    </>
    )
}