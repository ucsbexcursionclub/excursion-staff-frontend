import React from "react";
import Typography from "@mui/material/Typography";
import StaffCard from "./StaffCard"; // Import your StaffCard component
import {useQuery} from "@tanstack/react-query";
import {getStaffProfiles} from "../utils/api";

const StaffGrid: React.FC = () => {
    const {data: staffProfiles} = useQuery({
        queryKey: ["staffProfiles"],
        queryFn: getStaffProfiles
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
            "Prospective Staff": 1,
            "Emeritus Staff": 0
        };

        const positionA = a.positions[0].toLowerCase();
        const positionB = b.positions[0].toLowerCase();

        return positionOrder[positionA] - positionOrder[positionB];
    });

    // Separate staff into "Board" and "General Staff" sections
    const boardStaff = sortedStaff
        .filter(
            (staffMember) =>
                staffMember.positions[0].toLowerCase() === "director" ||
                staffMember.positions[0].toLowerCase() === "treasurer" ||
                staffMember.positions[0].toLowerCase() === "general board"
        )
        .sort((a, b) => {
            // Define the specific order for board positions
            const boardPositionOrder: {[position: string]: number} = {
                director: 1,
                treasurer: 2,
                "general board": 3
            };

            // Get the order for each staff member's primary position
            const positionA = boardPositionOrder[a.positions[0].toLowerCase()] || 4;
            const positionB = boardPositionOrder[b.positions[0].toLowerCase()] || 4;

            // Sort based on the defined order
            return positionA - positionB;
        });

    const generalStaff = sortedStaff
        .filter(
            (staffMember) =>
                staffMember.positions[0].toLowerCase() !== "director" &&
                staffMember.positions[0].toLowerCase() !== "treasurer" &&
                staffMember.positions[0].toLowerCase() !== "general board" &&
                staffMember.positions[0].toLowerCase() !== "prospective staff" &&
                staffMember.positions[0].toLowerCase() !== "emeritus"
        )
        .sort((a, b) => {
            // Sort by bio presence, then by bio length
            const hasBioA = a.bio ? 1 : 0;
            const hasBioB = b.bio ? 1 : 0;
            if (hasBioA !== hasBioB) return hasBioB - hasBioA; // Place staff with bios first
            return (b.bio?.length || 0) - (a.bio?.length || 0); // Sort by bio length if both have bios
        });

    const prospectiveStaff = sortedStaff
        .filter(
            (staffMember) => 
                staffMember.positions[0].toLowerCase() === "prospective staff" &&
                staffMember.positions[0].toLowerCase() !== "emeritus"
        )
        .sort((a, b) => {
            // Sort by bio presence, then by bio length
            const hasBioA = a.bio ? 1 : 0;
            const hasBioB = b.bio ? 1 : 0;
            if (hasBioA !== hasBioB) return hasBioB - hasBioA; // Place staff with bios first
            return (b.bio?.length || 0) - (a.bio?.length || 0); // Sort by bio length if both have bios
        });

    const emeritusStaff = sortedStaff
        .filter((staffMember) => staffMember.positions[0].toLowerCase() === "emeritus")
        .sort((a, b) => {
            // Sort by bio presence, then by bio length
            const hasBioA = a.bio ? 1 : 0;
            const hasBioB = b.bio ? 1 : 0;
            if (hasBioA !== hasBioB) return hasBioB - hasBioA; // Place staff with bios first
            return (b.bio?.length || 0) - (a.bio?.length || 0); // Sort by bio length if both have bios
        });

    return (
        <div className="flex flex-col items-center">
            {/* Section for "Board" */}
            <div className="text-center">
                <Typography
                    variant="body2"
                    className="my-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black"
                >
                    Board
                </Typography>
                <div className="grid ml-0 w-full justify-start grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {boardStaff.map((staffProfile, index) => (
                        <div className="flex p-0 py-2 justify-center" key={index}>
                            <StaffCard staff={staffProfile} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Section for "General Staff" */}
            <div className="text-center">
                <Typography
                    variant="body2"
                    className="my-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black"
                >
                    Staff
                </Typography>
                <div className="grid ml-0 w-full justify-start grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {generalStaff.map((staffProfile, index) => (
                        <div className="flex p-0 py-2 justify-center" key={index}>
                            <StaffCard staff={staffProfile} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Section for "Prospective Staff" */}
            <div className="text-center">
                <Typography
                    variant="body2"
                    className="my-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black"
                >
                    Prospective Staff
                </Typography>
                <div className="grid ml-0 w-full justify-start grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {prospectiveStaff.map((staffProfile, index) => (
                        <div className="flex p-0 py-2 justify-center" key={index}>
                            <StaffCard staff={staffProfile} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Add a section for "Emeriti" if needed */}
            <div className="text-center">
                <Typography
                    variant="body2"
                    className="my-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black"
                >
                    Emeritus Staff
                </Typography>
                <div className="grid ml-0 w-full justify-start grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {emeritusStaff.map((staffProfile, index) => (
                        <div className="flex p-0 py-2 justify-center" key={index}>
                            <StaffCard staff={staffProfile} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StaffGrid;
