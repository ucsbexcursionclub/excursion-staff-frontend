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
import {useStaff} from "src/providers/StaffProvider";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

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

export default function StaffAddDialog({open, onClose}) {
    const [selectedPositions, setSelectedPositions] = useState([]);
    const [selectedMember, setSelectedMember] = useState<MemberProps | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {handleStaffAdd, handleStaffUpdate, retrieveStaffByMemberID} = useStaff();

    const handleCheckboxChange = (event) => {
        const position = event.target.name;
        setSelectedPositions((prevSelected) =>
            event.target.checked
                ? [...prevSelected, position]
                : prevSelected.filter((p) => p !== position)
        );
    };
    const handleAddStaffMember = async () => {
        const memberId = selectedMember ? selectedMember._id : "";

        // Check if a staff member with the same memberId already exists
        const existingStaff = retrieveStaffByMemberID(memberId);
        console.log("existingStaff:", existingStaff);

        if (existingStaff) {
            setErrorMessage(
                "Staff member with the same memberId already exists. Please use 'Update' instead."
            );
            errorMessage; // This is to remove the ESLint warning
            setTimeout(() => {
                setError(null);
            }, 5000); // 5000 milliseconds (5 seconds)
            return; // Exit the function without adding the staff member
        }

        // Create the staff member object with name and positions
        const newStaffData = {
            member_id: memberId,
            memberDetails: selectedMember || {},
            positions: selectedPositions,
            profileImageUrl: "", // You can add the profile image URL here
            bio: "" // You can add the bio here
        };

        // Call the handleStaffAdd function to add the staff member
        await handleStaffAdd(newStaffData);

        // Reset the form fields
        setSelectedPositions([]);
        setSelectedMember(null);

        // Close the dialog
        onClose();
    };

    const handleUpdateStaffMember = async () => {
        const existingStaff = retrieveStaffByMemberID(selectedMember._id);

        // Create the staff member object with updated data while maintaining existing values
        const updatedStaff = {
            ...existingStaff, // Maintain existing values
            member_id: selectedMember._id, // Use the member ID
            memberDetails: selectedMember, // Use the member details
            positions: selectedPositions
        };

        // Call the handleStaffUpdate function to update the staff member
        await handleStaffUpdate(updatedStaff);

        // Reset the form fields
        setSelectedPositions([]);
        setSelectedMember(null);

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
                {errorMessage && (
                    <Alert severity="error" sx={{mt: 2}}>
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleUpdateStaffMember} color="primary">
                    Update
                </Button>
                <Button onClick={handleAddStaffMember} color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
}
