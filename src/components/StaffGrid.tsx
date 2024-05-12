import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import StaffCard from "./StaffCard"; // Import your StaffCard component
import {useQuery} from "react-query";
import {useSnackbar} from "../providers/SnackBarProvider";
import {getStaffProfiles} from "../utils/api";
import {NotificationProps} from "../utils/types";

const StaffGrid: React.FC = () => {
    const {addNotification} = useSnackbar();
    const {data: staffProfiles} = useQuery({
        queryKey: ["staffProfiles"],
        queryFn: getStaffProfiles,
        onError: (err: Error) => {
            const newNotification: NotificationProps = {
                message: err.message,
                type: "error"
            };
            addNotification(newNotification);
        }
    });

    if (!staffProfiles) return;

    // Sort staff by position
    const sortedStaff = [...staffProfiles].sort((a, b) => {
        // Define the order of positions
        const positionOrder: {[position: string]: number} = {
            Director: 10,
            Treasurer: 4,
            "General Board": 4,
            "Web Developer": 3,
            "Camping Gear Head": 3,
            "Climbing Gear Head": 3,
            "Head of Water Sports": 3,
            "Head of Medicine": 3,
            "Social Media Head": 3,
            "Gear Fairy": 3,
            "Full Staff": 2,
            "Prospective Staff": 1
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
        <div className="flex flex-col items-center">
            {/* Section for "Board" */}
            <div className="mb-8 text-center">
                <Typography
                    variant="h4"
                    color="text-green-900"
                    sx={{fontSize: {xs: "24px", md: "32px"}}}
                    className="mb-4"
                >
                    Board
                </Typography>
                <Grid container className="ml-0 w-full justify-start" spacing={4}>
                    {boardStaff.map((staffProfile, index) => (
                        <Grid
                            className="flex p-0 py-8 justify-center"
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            key={index}
                        >
                            <StaffCard staff={staffProfile} />
                        </Grid>
                    ))}
                </Grid>
            </div>

            {/* Section for "General Staff" */}
            <div className="mb-8 text-center">
                <Typography
                    variant="h4"
                    color="text-green-900"
                    className="mb-4"
                    sx={{fontSize: {xs: "24px", md: "32px"}}}
                >
                    Staff
                </Typography>
                <Grid container className="ml-0 w-full justify-start" spacing={4}>
                    {generalStaff.map((staffProfile, index) => (
                        <Grid
                            className="flex p-0 py-8 justify-center"
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            key={index}
                        >
                            <StaffCard staff={staffProfile} />
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
                    className="mb-4"
                >
                    Prospective Staff
                </Typography>
                <Grid container className="ml-0 w-full justify-start" spacing={4}>
                    {prospectiveStaff.map((staffProfile, index) => (
                        <Grid
                            className="flex p-0 py-8 justify-center"
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            key={index}
                        >
                            <StaffCard staff={staffProfile} />
                        </Grid>
                    ))}
                </Grid>
            </div>

            {/* Add a section for "Emeriti" if needed */}
        </div>
    );
};

export default StaffGrid;
