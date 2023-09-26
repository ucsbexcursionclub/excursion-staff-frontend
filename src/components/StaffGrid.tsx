import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import StaffCard from "./StaffCard"; // Import your StaffCard component
import {StaffMemberProps} from "src/utils/types";

interface StaffGridProps {
    numColumns: number;
    staff: StaffMemberProps[];
}

const StaffGrid: React.FC<StaffGridProps> = ({numColumns, staff}) => {
    const columnWidthPercentage = `${100 / numColumns}%`;
    const gridItemStyle: React.CSSProperties = {
        flexBasis: `calc(${columnWidthPercentage} - 0.25rem)`, // Adjust for padding
        maxWidth: `calc(${columnWidthPercentage} - 0.25rem)`, // Adjust for padding
        minWidth: "80px",
        height: "100%",
        padding: "1rem"
    };

    // Sort staff by position
    const sortedStaff = [...staff].sort((a, b) => {
        // Define the order of positions
        const positionOrder: {[position: string]: number} = {
            Director: 1,
            Treasurer: 1,
            "General Board": 1,
            "Web Developer": 2,
            "Camping Gear Head": 2,
            "Climbing Gear Head": 2,
            "Head of Water Sports": 2,
            "Head of Medicine": 2,
            "Social Media Head": 2,
            "General Staff": 3,
            "Prospective Staff": 4
        };

        const positionA = a.staff_details.positions[0].toLowerCase();
        const positionB = b.staff_details.positions[0].toLowerCase();

        return positionOrder[positionA] - positionOrder[positionB];
    });

    // Separate staff into "Board" and "General Staff" sections
    const boardStaff = sortedStaff.filter(
        (staffMember) =>
            staffMember.staff_details.positions[0].toLowerCase() === "director" ||
            staffMember.staff_details.positions[0].toLowerCase() === "treasurer" ||
            staffMember.staff_details.positions[0].toLowerCase() === "general board"
    );

    const generalStaff = sortedStaff.filter(
        (staffMember) =>
            staffMember.staff_details.positions[0].toLowerCase() !== "director" &&
            staffMember.staff_details.positions[0].toLowerCase() !== "treasurer" &&
            staffMember.staff_details.positions[0].toLowerCase() !== "general board" &&
            staffMember.staff_details.positions[0].toLowerCase() !== "prospective staff"
    );

    const prospectiveStaff = sortedStaff.filter(
        (staffMember) =>
            staffMember.staff_details.positions[0].toLowerCase() === "prospective staff"
    );

    return (
        <div>
            {/* Section for "Board" */}
            <div style={{marginBottom: "2rem", textAlign: "center"}}>
                <Typography
                    variant="h4"
                    color="rgba(60,66,57,255)"
                    noWrap
                    sx={{fontSize: {xs: "24px", md: "32px"}}}
                >
                    Board
                </Typography>
                <Grid container justifyContent="flex-start" alignItems="center">
                    {boardStaff.map((staffMember) => (
                        <Grid item key={staffMember._id} style={gridItemStyle}>
                            <StaffCard staffMember={staffMember} />
                        </Grid>
                    ))}
                </Grid>
            </div>

            {/* Section for "General Staff" */}
            <div style={{marginBottom: "2rem", textAlign: "center"}}>
                <Typography
                    variant="h4"
                    color="rgba(60,66,57,255)"
                    noWrap
                    sx={{fontSize: {xs: "24px", md: "32px"}}}
                >
                    Staff
                </Typography>
                <Grid container justifyContent="flex-start" alignItems="center">
                    {generalStaff.map((staffMember) => (
                        <Grid item key={staffMember._id} style={gridItemStyle}>
                            <StaffCard staffMember={staffMember} />
                        </Grid>
                    ))}
                </Grid>
            </div>

            {/* Section for "Prospective Staff" */}
            <div style={{marginBottom: "2rem", textAlign: "center"}}>
                <Typography
                    variant="h4"
                    color="rgba(60,66,57,255)"
                    noWrap
                    sx={{fontSize: {xs: "24px", md: "32px"}}}
                >
                    Prospective Staff
                </Typography>
                <Grid container justifyContent="flex-start" alignItems="center">
                    {prospectiveStaff.map((staffMember) => (
                        <Grid item key={staffMember._id} style={gridItemStyle}>
                            <StaffCard staffMember={staffMember} />
                        </Grid>
                    ))}
                </Grid>
            </div>

            {/* Add a section for "Emeriti" if needed */}
        </div>
    );
};

export default StaffGrid;
