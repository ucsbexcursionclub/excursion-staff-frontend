import React, {useEffect, useState} from "react";
import {StaffProfile} from "../utils/types";
import {capitalizeFirstLetter, generateResourceUrl} from "../utils/utils";
import {Avatar, Chip} from "@mui/material";

interface StaffCardProps {
    staff: StaffProfile;
}

const StaffCard: React.FC<StaffCardProps> = ({staff}) => {
    const [imgSrc, setImgSrc] = useState(
        generateResourceUrl(staff.profileImagePath || "/resources/avatar.png")
    );

    useEffect(() => {
        setImgSrc(generateResourceUrl(staff.profileImagePath || "/resources/avatar.png"));
    }, [staff.profileImagePath]);

    return (
        <div className="w-full h-full p-2">
            <div className="flex flex-col items-center w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-full hover:shadow-md transition-shadow">
                <Avatar
                    src={imgSrc}
                    imgProps={{onError: () => setImgSrc(generateResourceUrl("/resources/avatar.png"))}}
                    alt={staff.name}
                    sx={{width: 100, height: 100, mb: 1.5, border: "3px solid #bbf7d0"}}
                />
                <h3 className="text-base font-bold text-gray-900 text-center leading-tight mb-0.5">
                    {capitalizeFirstLetter(staff.name)}
                </h3>
                <p className="text-xs text-gray-500 text-center mb-1 break-all">{staff.email}</p>
                <div className="flex flex-wrap justify-center gap-1 mb-2">
                    {staff.positions.map((pos) => (
                        <Chip
                            key={pos}
                            label={pos}
                            size="small"
                            sx={{
                                backgroundColor: "#d9f99d",
                                color: "#14532d",
                                fontWeight: 600,
                                fontSize: "0.7rem",
                                height: 20
                            }}
                        />
                    ))}
                </div>
                {staff.bio && (
                    <p className="text-xs text-gray-600 text-center break-words leading-relaxed">
                        {staff.bio}
                    </p>
                )}
            </div>
        </div>
    );
};

export default StaffCard;
