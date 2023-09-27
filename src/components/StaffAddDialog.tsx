import React, {useState} from "react";
import MembersAutoComplete from "src/components/MembersAutoComplete";
import {MemberProps} from "src/utils/types";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControlLabel,
    Checkbox
} from "@mui/material";

interface StaffAddDialog {
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

export default function StaffAddDialog({open, onAdd, onClose}) {
    const [selectedPositions, setSelectedPositions] = useState([]);
    const [selectedMember, setSelectedMember] = React.useState<MemberProps | null>(null);
    const [error, setError] = useState<boolean>(false);

    // Step 4: Callback function to handle member selection
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

    const handleAddStaffMember = () => {
        // STUB TO DO
        // Create the staff member object with name and positions

        // Call the onAdd callback to add the staff member
        onAdd();

        // Reset the form fields
        setSelectedPositions([]);

        // Close the dialog
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Staff Member</DialogTitle>
            <DialogContent>
                <MembersAutoComplete
                    error={error}
                    setError={setError}
                    setMemberVal={setSelectedMember}
                    memberVal={selectedMember}
                />
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
                <Button onClick={handleAddStaffMember} color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
}
