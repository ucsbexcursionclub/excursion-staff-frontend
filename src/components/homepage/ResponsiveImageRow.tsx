import React from "react";

type ResponsiveImageRowProps = {
    imageUrls: string[];
    screenWidth: number;
};

const ResponsiveImageRow = ({imageUrls, screenWidth}: ResponsiveImageRowProps) => {
    const numImages = imageUrls.length;
    const isMobileView = screenWidth <= 600;

    // Calculate the image width based on the number of images and screen width
    const imageWidth =
        numImages === 6 && !isMobileView ? `16%` : numImages === 6 && isMobileView ? `33%` : "100%";

    const rowStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        overflowX: "auto",
        flexWrap: "wrap" // Ensure images do not wrap
    };

    const imageStyle: React.CSSProperties = {
        flex: "0 0 " + imageWidth,
        width: imageWidth,
        maxWidth: "33%",
        height: "auto",
        marginBottom: "0px"
    };

    return (
        <div style={rowStyle}>
            {imageUrls.map((imageUrl, index) => (
                <img key={index} src={imageUrl} alt={`Image ${index}`} style={imageStyle} />
            ))}
        </div>
    );
};

export default ResponsiveImageRow;
