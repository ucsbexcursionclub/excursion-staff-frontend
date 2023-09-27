import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import StaffCard from "./StaffCard"; // Import your StaffCard component
import {useStaff} from "src/providers/StaffProvider";

const StaffGrid: React.FC = () => {
    const {staffData} = useStaff();

    const positionsWeights = {
        Director: 1, // 1 Director
        Treasurer: 1, // 1 Treasurer
        "General Board": 5, // 5 General Board members
        "Web Developer": 5, // 5 Web Developers
        "Camping Gear Head": 5, // 5 Camping Gear Heads
        "Climbing Gear Head": 5, // 5 Climbing Gear Heads
        "Head of Water Sports": 4, // 4 Heads of Water Sports
        "Head of Medicine": 4, // 4 Heads of Medicine
        "Social Media Head": 4, // 4 Social Media Heads
        "Gear Fairy": 4, // 4 Gear Fairies
        "Full Staff": 20, // Majority of the staff falls here. 20 members.
        "Prospective Staff": 10 // Newcomers or short-term staff. 10 members.
    };

    const expandedPositions: string[] = [];
    for (const [position, weight] of Object.entries(positionsWeights)) {
        for (let i = 0; i < weight; i++) {
            expandedPositions.push(position);
        }
    }

    // Populate positions for each staff member
    staffData.forEach((staff) => {
        staff.positions = [];
        // Decide how many positions this staff will have, for demonstration let's say 1 to 3
        const numPositions = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < numPositions; i++) {
            const randomPositionIndex = Math.floor(Math.random() * expandedPositions.length);
            const randomPosition = expandedPositions[randomPositionIndex];
            if (!staff.positions.includes(randomPosition)) {
                // Ensure the same position is not added multiple times
                staff.positions.push(randomPosition);
            }
        }
    });
    // Sort staff by position
    const sortedStaff = [...staffData].sort((a, b) => {
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
            "Gear Fairy": 2,
            "Full Staff": 3,
            "Prospective Staff": 4
        };

        const positionA = a.positions[0].toLowerCase();
        const positionB = b.positions[0].toLowerCase();

        return positionOrder[positionA] - positionOrder[positionB];
    });

    // Separate staff into "Board" and "General Staff" sections
    const boardStaff = sortedStaff.filter(
        (staffMember) =>
            staffMember.positions[0].toLowerCase() === "director" ||
            staffMember.positions[0].toLowerCase() === "treasurer" ||
            staffMember.positions[0].toLowerCase() === "general board"
    );

    const generalStaff = sortedStaff.filter(
        (staffMember) =>
            staffMember.positions[0].toLowerCase() !== "director" &&
            staffMember.positions[0].toLowerCase() !== "treasurer" &&
            staffMember.positions[0].toLowerCase() !== "general board" &&
            staffMember.positions[0].toLowerCase() !== "prospective staff"
    );

    const prospectiveStaff = sortedStaff.filter(
        (staffMember) => staffMember.positions[0].toLowerCase() === "prospective staff"
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
                <Grid container spacing={{xs: 2, md: 3}} columns={{xs: 4, sm: 8, md: 12}}>
                    {boardStaff.map((staffMember) => (
                        <Grid item xs={2} sm={4} md={4} key={staffMember._id}>
                            <StaffCard staff={staffMember} />
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
                        <Grid item key={staffMember._id}>
                            <StaffCard staff={staffMember} />
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
                        <Grid item key={staffMember._id}>
                            <StaffCard staff={staffMember} />
                        </Grid>
                    ))}
                </Grid>
            </div>

            {/* Add a section for "Emeriti" if needed */}
        </div>
    );
};

export default StaffGrid;
