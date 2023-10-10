import React, {useState, useEffect} from "react";
import MembersAutoComplete from "./MembersAutoComplete";
import {IdentityProps, MemberProps, NewStaffProps} from "../utils/types";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControlLabel,
    Checkbox,
    RadioGroup,
    Radio
} from "@mui/material";
import {useStaff} from "../providers/StaffProvider";
import {positionOptions} from "../utils/constants";
import {BlurBackDrop} from "./HelperComponents";
import {useMembers} from "../providers/MembersProvider";

type StaffAddDialogProps = {
    open: boolean;
    onClose: () => void;
};

export default function StaffAddDialog({open, onClose}: StaffAddDialogProps) {
    const [selectedPositions, setSelectedPositions] = useState([]);
    const [selectedMember, setSelectedMember] = useState<MemberProps | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [disableAdd, setDisableAdd] = useState<boolean>(false);
    const [role, setRole] = useState<IdentityProps["role"]>("staff");

    const {handleStaffAdd, handleStaffUpdate, retrieveStaffById} = useStaff();
    const {handleMemberUpdate} = useMembers();

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

    const handleRoleChange = (event) => {
        const position = event.target.value;
        setRole(position);
    };

    useEffect(() => {
        const staffId = selectedMember?.staff_id;

        const existingStaff = staffId && retrieveStaffById(staffId);

        setDisableAdd(!!existingStaff);

        existingStaff?.role && setRole(existingStaff.role);

        setSelectedPositions(existingStaff?.positions || []);
    }, [selectedMember, retrieveStaffById]);

    const handleAddStaffMember = async () => {
        if (!selectedMember) return;

        const memberId = selectedMember._id;

        // Create the staff member object with name and positions
        const newStaffData: NewStaffProps = {
            member_id: memberId,
            positions: selectedPositions,
            role: role
        };

        // Call the handleStaffAdd function to add the staff member
        await handleStaffAdd(newStaffData);
        await handleMemberUpdate(selectedMember);

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
            positions: selectedPositions,
            role: role
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
                    <p>Staff Positions:</p>
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
                <p>Website Priviledges:</p>
                <RadioGroup
                    className="flex flex-row"
                    aria-label="role"
                    name="role"
                    value={role}
                    onChange={handleRoleChange}
                >
                    <FormControlLabel value="staff" control={<Radio />} label="Staff" />
                    <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                </RadioGroup>
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
