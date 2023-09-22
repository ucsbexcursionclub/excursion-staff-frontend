import React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const StyledPaper = Paper;

// interface GearItem {
//     imageUrl: string;
//     title: string;
// }

interface Props {
    columns: number;
    labelFontSize: number;
}

const gearItems = [
    {
        imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/SleepingBag.jpg",
        title: "Sleeping Bags"
    },
    {
        imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/SleepingPad.jpg",
        title: "Sleeping Pads"
    },
    {
        imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/Tent.jpg",
        title: "Tents"
    },
    {
        imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/Backpack.jpg",
        title: "Backpacks"
    },
    {
        imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/ColemanStove.jpg",
        title: "Camping Stoves"
    },
    {
        imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/BackpackingStove.jpg",
        title: "Backpacking Stoves"
    },
    {
        imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/Waterfilter.jpg",
        title: "Water Filters"
    },
    {
        imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/Surfboards.jpg",
        title: "Surfboards"
    },
    {
        imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/Kayak.jpg",
        title: "Ocean Kayaks"
    },
    {
        imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/Wetsuits.jpg",
        title: "Wetsuits"
    },
    {
        imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/YogaMat.jpg",
        title: "Yoga Mats"
    },
    {
        imageUrl: "http://d36olvmp8krees.cloudfront.net/resources/Hammock.JPG",
        title: "Hammocks"
    }
];

export default function GearGrid({columns, labelFontSize}: Props) {
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
        color: "rgba(42,49,39,255)"
    };

    return (
        <div className="w-full px-3">
            <Grid
                container
                rowSpacing={1}
                className="flex bg-lime-200 justify-center align-start rounded-xl"
                columnSpacing={1}
            >
                {gearItems.map((item, index) => (
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
