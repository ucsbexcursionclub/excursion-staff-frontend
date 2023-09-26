import React from "react";
import Backdrop from "@mui/material/Backdrop";

const BlurBackDrop = ({open, handleClose}) => {
    return (
        <Backdrop
            className="backdrop-blur-md"
            style={{backgroundColor: "rgba(0, 0, 0, 0.1)"}}
            open={open}
            onClick={handleClose}
        ></Backdrop>
    );
};

export {BlurBackDrop};
