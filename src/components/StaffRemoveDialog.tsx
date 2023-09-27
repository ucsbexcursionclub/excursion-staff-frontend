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
// import {useStaff} from "src/providers/StaffProvider";

type StaffRemoveDialogProps = {
    open: boolean;
    onClose: () => void;
};

// TODO uncomment when StaffProvider is done
const StaffRemoveDialog: React.FC<StaffRemoveDialogProps> = ({open, onClose}) => {
    //   const { retrieveStaffMember, handleStaffMemberDelete, staffRowSelectionModel } = useStaff();

    //   const staffMembersToDelete = staffRowSelectionModel.map((id) =>
    //     retrieveStaffMember(id.toString())
    //   );

    //   async function handleConfirmDelete() {
    //     await handleStaffMemberDelete(staffMembersToDelete);
    //     onClose();
    //   }

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"xs"}>
            <DialogTitle sx={{px: 3, fontWeight: "bold", fontSize: "24px"}}>
                Confirm Deletion
            </DialogTitle>

            <List sx={{pt: 0, px: 2}}>
                {/* {staffMembersToDelete.map((staffMember) => (
          <ListItem key={staffMember._id}>
            <Typography color="textSecondary">{staffMember.name}</Typography>
          </ListItem>
        ))} */}
            </List>

            <DialogActions>
                <Button onClick={onClose} variant="contained" color="primary">
                    Cancel
                </Button>
                <Button
                    // onClick={handleConfirmDelete}
                    variant="contained"
                    color="error"
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StaffRemoveDialog;
