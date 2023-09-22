import React from "react";

const PricingColumns = ({medFontSize}) => {
    const leftColumnStyle = {
        backgroundColor: "#f1f1f1", // Left column background color
        padding: "20px",
        paddingTop: "7px",
        fontSize: `${parseInt(medFontSize) - 1}px`
    };

    const rightColumnStyle = {
        backgroundColor: "#e0e0e0", // Right column background color
        padding: "20px",
        paddingTop: "7px",
        fontSize: `${parseInt(medFontSize) - 1}px`
    };

    const ulStyle = {
        listStyleType: "none",
        padding: 0,
        fontSize: `${parseInt(medFontSize) - 1}px`
    };

    const liStyle = {
        marginBottom: "10px",
        fontSize: `${parseInt(medFontSize) - 4}px`
    };
    const columnsContainerStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        maxWidth: "600px", // Adjust as needed
        margin: "0 auto" // Center the columns
    };

    const columnStyle = {
        flexBasis: "48%" // Adjust the width of each column as needed
    };

    return (
        <div style={columnsContainerStyle}>
            <div style={{...columnStyle, ...leftColumnStyle}}>
                <h3>Pricing for New Members</h3>
                <ul style={ulStyle}>
                    <li style={liStyle}>For 365 Days (best deal): $60</li>
                    <li style={liStyle}>For 180 Days: $50</li>
                    <li style={liStyle}>For 90 Days: $30</li>
                </ul>
            </div>
            <div style={{...columnStyle, ...rightColumnStyle}}>
                <h3>Pricing for Continuing</h3>
                <ul style={ulStyle}>
                    <li style={liStyle}>For 365 Days: $40</li>
                    <li style={liStyle}>For 90 Days: $20</li>
                </ul>
            </div>
        </div>
    );
};

export default PricingColumns;
