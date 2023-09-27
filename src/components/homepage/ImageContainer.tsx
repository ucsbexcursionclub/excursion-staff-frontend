import React from "react";

type ImageContainerProps = {
    imgurl: string;
    bigFontSize: string;
    textInput?: string;
};

const ImageContainer = ({imgurl, bigFontSize, textInput}: ImageContainerProps) => {
    const imageStyle = {
        width: "100%" // Make the image fill the width of the screen
    };

    const imageContainerStyle: React.CSSProperties = {
        position: "relative",
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
        backgroundColor: "transparent"
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
                <div style={textOverlayStyle}>{textInput}</div>
            </div>
        </div>
    );
};

export default ImageContainer;
