import React from "react";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import StaffCard from "./StaffCard";
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

    if (!staffProfiles) {
        return (
            <div className="w-full">
                <div className="flex items-center gap-3 mb-4">
                    <Skeleton variant="text" width={120} height={32} />
                    <span className="flex-1 h-px bg-lime-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Array.from({length: 10}).map((_, i) => (
                        <div key={i} className="p-2">
                            <div className="flex flex-col items-center bg-white rounded-2xl border border-gray-100 p-4">
                                <Skeleton variant="circular" width={100} height={100} />
                                <Skeleton variant="text" width="70%" className="mt-2" />
                                <Skeleton variant="text" width="90%" />
                                <Skeleton variant="rounded" width={80} height={20} className="mt-1" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Safe accessor — returns empty string for staff with no positions set
    const pos0 = (s: typeof staffProfiles[0]) => (s.positions?.[0] ?? "").toLowerCase();

    // Sort staff by position
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

    const sortedStaff = [...staffProfiles].sort(
        (a, b) => (positionOrder[pos0(a)] ?? 0) - (positionOrder[pos0(b)] ?? 0)
    );

    const boardPositionOrder: {[position: string]: number} = {director: 1, treasurer: 2, "general board": 3};

    const boardStaff = sortedStaff
        .filter((s) => ["director", "treasurer", "general board"].includes(pos0(s)))
        .sort((a, b) => (boardPositionOrder[pos0(a)] ?? 4) - (boardPositionOrder[pos0(b)] ?? 4));

    const generalStaff = sortedStaff
        .filter((s) => !["director", "treasurer", "general board", "prospective staff", "emeritus"].includes(pos0(s)))
        .sort((a, b) => {
            const hasBioA = a.bio ? 1 : 0;
            const hasBioB = b.bio ? 1 : 0;
            if (hasBioA !== hasBioB) return hasBioB - hasBioA;
            return (b.bio?.length || 0) - (a.bio?.length || 0);
        });

    const webDevStaff = sortedStaff.filter((s) =>
        s.positions?.some((p) => p.toLowerCase() === "web developer")
    );


    const bioSort = (a: typeof sortedStaff[0], b: typeof sortedStaff[0]) => {
        const hasBioA = a.bio ? 1 : 0;
        const hasBioB = b.bio ? 1 : 0;
        if (hasBioA !== hasBioB) return hasBioB - hasBioA;
        return (b.bio?.length || 0) - (a.bio?.length || 0);
    };

    const prospectiveStaff = sortedStaff
        .filter((s) => pos0(s) === "prospective staff")
        .sort(bioSort);

    const emeritusStaff = sortedStaff
        .filter((s) => pos0(s) === "emeritus")
        .sort(bioSort);

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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
