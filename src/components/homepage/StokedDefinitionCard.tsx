import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const cardStyle = {
    display: "flex",
    flexDirection: "row", // Display in a row layout
    alignItems: "flex-start", // Align items at the top
    justifyContent: "flex-end", // Align the left column to the right
    minWidth: 275
};

const columnLeftStyle: React.CSSProperties = {
    flex: 0.5, // Take up the left column
    paddingRight: "8px", // Add right padding to create space
    textAlign: "right"
};

const dividerStyle = {
    width: "2px",
    backgroundColor: "black",
    margin: "0 16px", // Add margin for spacing
    height: "100%" // Match the card's height
};

const columnRightStyle = {
    flex: 2, // Take up the right column (twice the width of the left)
    paddingRight: "40px" // Add right padding to create space
};

interface StokedDefinitionCardProps {
    fontsize: string;
}

export default function StokedDefinitionCard(props: StokedDefinitionCardProps) {
    const {fontsize} = props;

    return (
        <Card sx={cardStyle} square>
            <CardContent style={columnLeftStyle}>
                <Typography variant="h5" component="div" fontSize={`${parseInt(fontsize) + 2}px`}>
                    stoked
                </Typography>
                <Typography
                    variant="body2"
                    sx={{mb: 1.5}}
                    color="text.secondary"
                    fontSize={`${parseInt(fontsize) + 2}px`}
                >
                    /stōkt/
                    <br />
                    adjective
                </Typography>
            </CardContent>
            <div style={dividerStyle}></div> {/* Vertical Line */}
            <CardContent style={columnRightStyle}>
                <Typography variant="body2" fontSize={fontsize}>
                    To be stoked is to be completely and intensely enthusiastic, exhilarated, or
                    excited about something. Those who are stoked all of the time know this; being
                    stoked is the epitome of all being. When one is stoked, there is no limit to
                    what one can do.
                </Typography>
            </CardContent>
        </Card>
    );
}
