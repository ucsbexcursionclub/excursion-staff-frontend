import React from "react";

const ImageContainer = ({imgurl, bigFontSize}) => {
    const imageStyle = {
        width: "100%", // Make the image fill the width of the screen
        height: "auto", // Maintain the image's aspect ratio
        paddingBottom: "0",
        margin: 0, // Remove margin
        padding: 0 // Remove padding
    };

    const imageContainerStyle: React.CSSProperties = {
        position: "relative",
        height: "auto",
        backgroundColor: "white"
    };

    const textOverlayContainerStyle: React.CSSProperties = {
        position: "absolute",
        bottom: "10px",
        left: "0",
        right: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        height: "auto",
        paddingBottom: "0"
    };

    const textOverlayStyle: React.CSSProperties = {
        padding: "8px", // Add padding to the text
        fontWeight: "bold",
        textAlign: "center",
        paddingBottom: "0",
        color: "white", // Make the text white
        fontSize: bigFontSize
    };

    return (
        <div style={imageContainerStyle}>
            <img src={imgurl} alt="Homepage Image" style={imageStyle} />
            <div style={textOverlayContainerStyle}>
                <div style={textOverlayStyle}>{"We Do it Outdoors"}</div>
            </div>
        </div>
    );
};

export default ImageContainer;
