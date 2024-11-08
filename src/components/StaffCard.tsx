import React from "react";
import {StaffProfile} from "../utils/types";
import {capitalizeFirstLetter, generateResourceUrl} from "../utils/utils";

interface StaffCardProps {
    staff: StaffProfile;
}

const StaffCard: React.FC<StaffCardProps> = ({staff}) => {
    return (
        <div className="w-full h-full p-2">
            <div className="flex flex-col items-center w-full bg-gray-100 rounded-2xl shadow-sm p-4">
                <img
                    src={generateResourceUrl(staff.profileImagePath || "/resources/avatar.png")}
                    alt={staff.name}
                    className="w-full h-full sm:w-40 sm:h-40 md:w-52 md:h-52 object-cover rounded-md my-4"
                />
                <div className="w-full text-center">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-2">
                        {capitalizeFirstLetter(staff.name)}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-1">
                        {staff.email}
                    </p>
                    <p className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-3">
                        {staff.positions.join(", ")}
                    </p>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 break-words">
                        {staff.bio}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StaffCard;
