import React, {useState} from "react";
// import StaffAutoComplete from "src/components/StaffAutoComplete";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControlLabel,
    Checkbox
} from "@mui/material";

interface StaffUpdateDialog {
    open: boolean;
    onClose: () => void;
}
const positionOptions = [
    "Director",
    "Treasurer",
    "General Board",
    "Web Developer",
    "Camping Gear Head",
    "Climbing Gear Head",
    "Head of Water Sports",
    "Head of Medicine",
    "Social Media Head",
    "Gear Fairy",
    "Full Staff",
    "Prospective Staff"
];

export default function StaffUpdateDialog({open, onUpdate, onClose}) {
    const [selectedPositions, setSelectedPositions] = useState([]);
    // const [selectedMember, setSelectedMember] = React.useState<MemberProps | null>(null);
    // const [error, setError] = useState<boolean>(false);

    // // Step 4: Callback function to handle member selection
    // const handleMemberChange = (newValue: MemberProps | null) => {
    //     setSelectedMember(newValue);
    // };

    const handleCheckboxChange = (event) => {
        const position = event.target.name;
        setSelectedPositions((prevSelected) =>
            event.target.checked
                ? [...prevSelected, position]
                : prevSelected.filter((p) => p !== position)
        );
    };

    const handleUpdateStaffMember = () => {
        // STUB TO DO
        // Create the staff member object with name and positions

        // Call the onUpdate callback to Update the staff member
        onUpdate();

        // Reset the form fields
        setSelectedPositions([]);

        // Close the dialog
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Update Staff Member</DialogTitle>
            <DialogContent>
                {/* <StaffAutoComplete /> */}
                <div>
                    <p>Positions:</p>
                    {positionOptions.map((position) => (
                        <FormControlLabel
                            key={position}
                            control={
                                <Checkbox
                                    checked={selectedPositions.includes(position)}
                                    onChange={handleCheckboxChange}
                                    name={position}
                                />
                            }
                            label={position}
                        />
                    ))}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleUpdateStaffMember} color="primary">
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
}
