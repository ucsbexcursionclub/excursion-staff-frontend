import React from "react";
import Typography from "@mui/material/Typography";
import StaffCard from "./StaffCard"; // Import your StaffCard component
import {useQuery} from "@tanstack/react-query";
import {getStaffProfiles} from "../utils/api";

const StaffGrid: React.FC = () => {
    const {data: staffProfiles} = useQuery({
        queryKey: ["staffProfiles"],
        queryFn: getStaffProfiles,
        // Periodic refetch keeps signed CloudFront cookies alive so avatars don't expire mid-session.
        refetchInterval: 1000 * 60 * 45,
        refetchIntervalInBackground: true
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

    // Ensure Web Developer(s) appear at the front of the Staff section.
    // Extract Web Developer entries (case-insensitive) from the general staff list
    // and render them first. This keeps the original sorting for the remainder.
    const webDevStaff = sortedStaff.filter((staffMember) =>
        staffMember.positions?.find((pos) => pos.toLowerCase() === "web developer") || staffMember.positions[0].length === 0
    );


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

    const renderSection = (title: string, members: typeof sortedStaff, extra?: typeof sortedStaff) => {
        const all = extra ? [...extra, ...members] : members;
        if (all.length === 0) return null;
        return (
            <div className="w-full mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{color: "#14532d", letterSpacing: "-0.3px"}}
                    >
                        {title}
                    </Typography>
                    <span className="flex-1 h-px bg-lime-200" />
                    <Typography variant="caption" sx={{color: "#6b7280"}}>
                        {all.length} member{all.length !== 1 ? "s" : ""}
                    </Typography>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {all.map((staffProfile, index) => (
                        <StaffCard staff={staffProfile} key={index} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full">
            {renderSection("Board", boardStaff)}
            {renderSection("Staff", generalStaff, webDevStaff)}
            {renderSection("Prospective Staff", prospectiveStaff)}
            {renderSection("Emeritus Staff", emeritusStaff)}
        </div>
    );
};

export default StaffGrid;
