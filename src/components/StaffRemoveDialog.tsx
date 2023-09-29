import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    Typography,
    List,
    ListItem
} from "@mui/material";
import {useStaff} from "src/providers/StaffProvider";
import {BlurBackDrop} from "./HelperComponents";

type StaffRemoveDialogProps = {
    open: boolean;
    onClose: () => void;
};

const StaffRemoveDialog: React.FC<StaffRemoveDialogProps> = ({open, onClose}) => {
    const handleClose = () => {
        onClose();
    };

    const {retrieveStaffById, handleStaffDelete, staffRowSelectionModel} = useStaff();

    const staffMembersToDelete = staffRowSelectionModel.map((id) =>
        retrieveStaffById(id.toString())
    );

    async function handleConfirmDelete() {
        await handleStaffDelete(staffMembersToDelete);
        handleClose();
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={"xs"}
            slots={{backdrop: BlurBackDrop}}
            slotProps={{
                backdrop: {
                    open: open,
                    onClose: handleClose
                }
            }}
        >
            {staffMembersToDelete.length > 0 && (
                <DialogTitle sx={{px: 3, fontWeight: "bold", fontSize: "24px"}}>
                    Confirm Deletion
                </DialogTitle>
            )}

            {staffMembersToDelete.length === 0 ? (
                <Typography sx={{px: 2, py: 2}}>Please select a row.</Typography>
            ) : (
                <>
                    <List sx={{pt: 0, px: 2}}>
                        {staffMembersToDelete.map((staffMember) => (
                            <ListItem key={staffMember._id}>
                                <Typography color="textSecondary">
                                    {staffMember.memberDetails.name}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>

                    <DialogActions>
                        <Button onClick={handleClose} variant="contained" color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDelete} variant="contained" color="error">
                            Confirm
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};

export default StaffRemoveDialog;
