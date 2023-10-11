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
import {useMembers} from "../providers/MembersProvider";
import {BlurBackDrop} from "./HelperComponents";
import {MemberProps} from "../utils/types";

type MemberRemoveDialogProps = {
    open: boolean;
    onClose: () => void;
};

const MemberRemoveDialog: React.FC<MemberRemoveDialogProps> = ({open, onClose}) => {
    const handleClose = () => {
        onClose();
    };

    const {retrieveMemberItem, handleMemberDelete, memberRowSelectionModel} = useMembers();

    const membersToDelete = memberRowSelectionModel
        .map((id) => retrieveMemberItem(id.toString()))
        .filter(Boolean) as MemberProps[];

    async function handleConfirmDelete() {
        await handleMemberDelete(membersToDelete);
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
            <DialogTitle sx={{px: 3, fontWeight: "bold", fontSize: "24px"}}>
                Confirm Deletion
            </DialogTitle>

            <List sx={{pt: 0, px: 2}}>
                {membersToDelete.map((member) => (
                    <ListItem key={member._id}>
                        <Typography color="textSecondary">{member.name}</Typography>
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
        </Dialog>
    );
};

export default MemberRemoveDialog;
