import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {useStaff} from "../providers/StaffProvider";
import {BlurBackDrop} from "./HelperComponents";
import {StaffProps} from "../utils/types";
import {useMembers} from "../providers/MembersProvider";

type StaffRemoveDialogProps = {
    open: boolean;
    onClose: () => void;
};

const StaffRemoveDialog: React.FC<StaffRemoveDialogProps> = ({open, onClose}) => {
    const handleClose = () => {
        onClose();
    };

    const {retrieveStaffById, handleStaffDelete, staffRowSelectionModel} = useStaff();
    const {refetchMembers} = useMembers();

    const staffMembersToDelete: StaffProps[] = staffRowSelectionModel
        .map((id) => retrieveStaffById(id.toString()))
        .filter(Boolean) as StaffProps[];

    async function handleConfirmDelete() {
        await handleStaffDelete(staffMembersToDelete);
        //need to refetch member data from db as now updated members no longer have a staff id attached
        //would do this inside staff provider, but staff provider is not within the context of member provider
        await refetchMembers(staffMembersToDelete.map((member) => member.member_id));
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
                    onClose: handleClose //if you see an error here open index.tsx file, theres an override that the compiler might not notice at first
                }
            }}
        >
            <>
                {staffMembersToDelete.length > 0 && (
                    <>
                        <DialogTitle sx={{px: 3, fontWeight: "bold", fontSize: "24px"}}>
                            Confirm Deletion
                        </DialogTitle>

                        <List sx={{pt: 0, px: 2}}>
                            {staffMembersToDelete.map((staffMember) => {
                                return (
                                    <ListItem key={staffMember._id}>
                                        <Typography color="textSecondary">
                                            {staffMember.memberDetails?.name}
                                        </Typography>
                                    </ListItem>
                                );
                            })}
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
            </>
        </Dialog>
    );
};

export default StaffRemoveDialog;
