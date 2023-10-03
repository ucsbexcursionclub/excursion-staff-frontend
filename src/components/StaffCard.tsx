import React from "react";
import {styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {StaffProps} from "src/utils/types";
import {capitalizeFirstLetter} from "src/utils/utils"; // Import the function

interface StaffCardProps {
    staff: StaffProps;
}

const StyledStaffCard = styled("div")(({theme}) => ({
    backgroundColor: "rgba(232, 236, 230, 1)",
    ...theme.typography.body2,
    color: "rgba(60, 66, 57, 255)",
    cursor: "pointer",
    "&:hover": {
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
    },
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(2),
    display: "flex",
    flexDirection: "column", // Display as a column
    alignItems: "center", // Center items horizontally
    textAlign: "center", // Center text horizontally
    width: "max-content", // Set width to fit content
    padding: `10px` // Add some padding
}));

StyledStaffCard;

const StyledAvatar = styled("img")({
    maxWidth: "100%",
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "8px" // Add some space between the image and text
});

const StaffCard: React.FC<StaffCardProps> = ({staff}) => {
    const nameParts = staff.memberDetails?.name.split(" ");
    const firstName = nameParts ? capitalizeFirstLetter(nameParts[0]) : "";
    const lastName =
        nameParts && nameParts.length > 1
            ? capitalizeFirstLetter(nameParts[nameParts.length - 1])
            : "";

    return (
        <div>
            <StyledAvatar
                src={
                    staff.profileImageUrl ||
                    "https://d36olvmp8krees.cloudfront.net/resources/avatar.png"
                }
                alt={staff.memberDetails?.name}
                className="avatar"
            />
            <div className="info">
                <Typography variant="h6" className="font-bold">
                    {firstName} {lastName}
                </Typography>
                <div className="positions">
                    <Typography variant="body2" className="position">
                        {staff.positions.join(", ")}
                    </Typography>
                </div>
                <Typography variant="body2" className="bio">
                    {staff.bio}
                </Typography>
                <Typography variant="body2" className="email">
                    {staff.memberDetails?.email}
                </Typography>
            </div>
        </div>
    );
};

export default StaffCard;
