import React from "react"

const CustomGrid = ({ className, children }, ref) => {
    return (
        <div className={"grid " + className} ref={ref}>
            {children}
        </div >
    )
}

export default React.forwardRef(CustomGrid)