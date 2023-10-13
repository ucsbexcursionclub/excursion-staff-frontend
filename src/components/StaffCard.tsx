import React from "react";
import Typography from "@mui/material/Typography";
import {StaffProfile} from "../utils/types";
import {capitalizeFirstLetter} from "../utils/utils"; // Import the function
import {Avatar} from "@mui/material";

interface StaffCardProps {
    staff: StaffProfile;
}

const StaffCard: React.FC<StaffCardProps> = ({staff}) => {
    return (
        <div className="flex flex-col items-center w-min bg-gray-100 p-8 rounded-2xl shadow-sm">
            <Avatar
                src={
                    staff.profileImageUrl ||
                    "https://d36olvmp8krees.cloudfront.net/resources/avatar.png"
                }
                alt={staff.name}
                className="w-52 h-52 object-cover rounded-md mb-2"
            />
            <div className="info">
                <Typography variant="h6" className="font-bold">
                    {capitalizeFirstLetter(staff.name)}
                </Typography>
                <Typography variant="body2" className="email mb-1">
                    {staff.email}
                </Typography>
                <div className="positions">
                    <Typography variant="body2" className="position font-bold mb-3">
                        {staff.positions.join(", ")}
                    </Typography>
                </div>

                <Typography variant="body2" className="bio">
                    {staff.bio}
                </Typography>
            </div>
        </div>
    );
};

export default StaffCard;
