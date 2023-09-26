import React from "react";
import {styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {StaffMemberProps} from "src/utils/types";

interface StaffCardProps {
    staffMember: StaffMemberProps;
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

const StyledAvatar = styled("img")({
    maxWidth: "100%",
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "8px" // Add some space between the image and text
});

const StaffCard: React.FC<StaffCardProps> = ({staffMember}) => {
    return (
        <StyledStaffCard className="staff-card">
            <StyledAvatar
                src={staffMember.staff_details.profileImageUrl}
                alt={staffMember.name}
                className="avatar"
            />
            <div className="info">
                <Typography variant="h6" className="font-bold">
                    {staffMember.name}
                </Typography>
                <div className="positions">
                    <Typography variant="body2" className="position">
                        {staffMember.staff_details.positions.join(", ")}
                    </Typography>
                </div>
                <Typography variant="body2" className="bio">
                    {staffMember.staff_details.bio}
                </Typography>
                <Typography variant="body2" className="email">
                    {staffMember.email}
                </Typography>
            </div>
        </StyledStaffCard>
    );
};

export default StaffCard;
