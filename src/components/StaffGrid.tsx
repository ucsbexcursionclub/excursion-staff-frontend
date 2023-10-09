import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import StaffCard from "./StaffCard"; // Import your StaffCard component
import {useStaff} from "../providers/StaffProvider";

const StaffGrid: React.FC = () => {
    //TODO: extract this to some safe function where we just pull staff information like name, email, bio
    const {staffData} = useStaff();
    // console.log(staffData);

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
            <div className="mb-8 text-center">
                <Typography
                    variant="h4"
                    color="text-green-900"
                    sx={{fontSize: {xs: "24px", md: "32px"}}}
                >
                    Board
                </Typography>
                <Grid container justifyContent="left" spacing={4}>
                    {boardStaff.map((staffMember) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={staffMember._id}>
                            <StaffCard staff={staffMember} />
                        </Grid>
                    ))}
                </Grid>
            </div>

            {/* Section for "General Staff" */}
            <div className="mb-8 text-center">
                <Typography
                    variant="h4"
                    color="text-green-900"
                    sx={{fontSize: {xs: "24px", md: "32px"}}}
                >
                    Staff
                </Typography>
                <Grid container justifyContent="left" spacing={4}>
                    {generalStaff.map((staffMember) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={staffMember._id}>
                            <StaffCard staff={staffMember} />
                        </Grid>
                    ))}
                </Grid>
            </div>

            {/* Section for "Prospective Staff" */}
            <div className="mb-8 text-center">
                <Typography
                    variant="h4"
                    color="text-green-900"
                    sx={{fontSize: {xs: "24px", md: "32px"}}}
                >
                    Prospective Staff
                </Typography>
                <Grid container justifyContent="left" spacing={4}>
                    {prospectiveStaff.map((staffMember) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={staffMember._id}>
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
