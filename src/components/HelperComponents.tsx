import React from "react";
import Backdrop from "@mui/material/Backdrop";

type BlurBackDropProps = {
    open: boolean;
    onClose: () => void;
};

const BlurBackDrop = ({open, onClose}: BlurBackDropProps) => {
    const handleClose = () => {
        onClose();
    };

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
