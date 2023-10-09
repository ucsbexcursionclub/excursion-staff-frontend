import React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {sampleGearItems} from "../../data/gear";

const StyledPaper = Paper;

interface GearGridProps {
    columns: number;
    labelFontSize: number;
}

export default function GearGrid({columns, labelFontSize}: GearGridProps) {
    // Calculate the width percentage for each column
    const columnWidthPercentage = `${100 / columns}%`;

    // Define a style object for each grid item
    const gridItemStyle = {
        flexBasis: `calc(${columnWidthPercentage} - 0.25rem)`, // Adjust for padding
        maxWidth: `calc(${columnWidthPercentage} - 0.25rem)`, // Adjust for padding
        minWidth: "80px",
        height: "100%",
        padding: "1rem"
    };

    const labelStyle: React.CSSProperties = {
        fontSize: labelFontSize,
        fontWeight: "bold",
        textAlign: "center",
        color: "#829195"
    };

    return (
        <div className="w-full px-3">
            <Grid
                container
                rowSpacing={1}
                className="flex bg-lime-200 justify-center align-start rounded-xl"
                columnSpacing={1}
            >
                {sampleGearItems.map((item, index) => (
                    <Grid
                        item
                        key={index}
                        style={gridItemStyle} // Apply the style object as inline styles
                    >
                        <StyledPaper
                            sx={{
                                mx: "auto",
                                p: 2,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between"
                            }}
                            className="bg-lime-100 text-white rounded-2xl"
                        >
                            <div
                                style={{
                                    width: "100%",
                                    paddingBottom: "100%",
                                    position: "relative"
                                }}
                            >
                                <img
                                    src={item.imageUrl}
                                    className="w-20"
                                    alt={item.title}
                                    style={{
                                        objectFit: "cover",
                                        width: "100%",
                                        height: "100%",
                                        position: "absolute",
                                        top: 0,
                                        left: 0
                                    }}
                                />
                            </div>
                        </StyledPaper>
                        <div className="flex justify-center">
                            <Typography style={labelStyle}>{item.title}</Typography>
                        </div>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
