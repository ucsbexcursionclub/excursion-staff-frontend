import React from "react";
import Typography from "@mui/material/Typography";
import {StaffProfile} from "../utils/types";
import {capitalizeFirstLetter, generateResourceUrl} from "../utils/utils"; // Import the function
import {Avatar} from "@mui/material";

interface StaffCardProps {
    staff: StaffProfile;
}

const StaffCard: React.FC<StaffCardProps> = ({staff}) => {
    return (
        <div className="w-full h-full p-8">
            <div className="flex flex-col items-center min-w-full bg-gray-100 rounded-2xl shadow-sm p-4 min-h-full">
                <Avatar
                    src={generateResourceUrl(staff.profileImagePath || "/resources/avatar.png")}
                    alt={staff.name}
                    className="w-52 h-52 object-cover rounded-md my-4"
                />
                <div className="w-full">
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

                    <Typography variant="body2" className="bio break-words">
                        {staff.bio}
                    </Typography>
                </div>
            </div>
        </div>
    );
};

export default StaffCard;
