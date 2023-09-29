import React, {useState, useEffect} from "react";
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
import {positionOptions} from "src/utils/constants";
import {BlurBackDrop} from "./HelperComponents";

type StaffAddDialogProps = {
    open: boolean;
    onClose: () => void;
};

export default function StaffAddDialog({open, onClose}: StaffAddDialogProps) {
    const [selectedPositions, setSelectedPositions] = useState([]);
    const [selectedMember, setSelectedMember] = useState<MemberProps | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [disableAdd, setDisableAdd] = useState<boolean>(false);

    const {handleStaffAdd, handleStaffUpdate, retrieveStaffById} = useStaff();

    const handleClose = () => {
        onClose();
    };

    const handleCheckboxChange = (event) => {
        const position = event.target.name;
        setSelectedPositions((prevSelected) =>
            event.target.checked
                ? [...prevSelected, position]
                : prevSelected.filter((p) => p !== position)
        );
    };

    useEffect(() => {
        const staffId = selectedMember?.staff_id;
        const existingStaff = staffId && retrieveStaffById(staffId);

        setDisableAdd(!!existingStaff);

        setSelectedPositions(existingStaff?.positions || []);
    }, [selectedMember, retrieveStaffById]);

    const handleAddStaffMember = async () => {
        if (!selectedMember) return;

        const memberId = selectedMember._id;

        // Create the staff member object with name and positions
        const newStaffData = {
            member_id: memberId,
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
        handleClose();
    };

    const handleUpdateStaffMember = async () => {
        if (!selectedMember) return;

        const existingStaff = retrieveStaffById(selectedMember.staff_id);

        // Create the staff member object with updated data while maintaining existing values
        const updatedStaff = {
            ...existingStaff,
            positions: selectedPositions
        };

        // Call the handleStaffUpdate function to update the staff member
        await handleStaffUpdate(updatedStaff);

        // Reset the form fields
        setSelectedPositions([]);
        setSelectedMember(null);

        // Close the dialog
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            slots={{backdrop: BlurBackDrop}}
            slotProps={{
                backdrop: {
                    open: open,
                    onClose: handleClose
                }
            }}
        >
            <DialogTitle>Add/Update Staff Member</DialogTitle>
            <DialogContent>
                <div className="mt-2">
                    <MembersAutoComplete
                        error={error}
                        setError={setError}
                        setMemberVal={setSelectedMember}
                        memberVal={selectedMember}
                    />
                </div>
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
                <Button
                    disabled={!disableAdd}
                    variant="outlined"
                    onClick={handleUpdateStaffMember}
                    color="primary"
                >
                    Update
                </Button>
                <Button
                    disabled={disableAdd}
                    variant="outlined"
                    onClick={handleAddStaffMember}
                    color="primary"
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
}
