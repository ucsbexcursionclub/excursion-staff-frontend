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
import {useMembers} from "src/providers/MembersProvider";

type MemberRemoveDialogProps = {
    open: boolean;
    onClose: () => void;
};

const MemberRemoveDialog: React.FC<MemberRemoveDialogProps> = ({open, onClose}) => {
    const {retrieveMemberItem, handleMemberDelete, memberRowSelectionModel} = useMembers();

    const membersToDelete = memberRowSelectionModel.map((id) => retrieveMemberItem(id.toString()));

    async function handleConfirmDelete() {
        await handleMemberDelete(membersToDelete);
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"xs"}>
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
                <Button onClick={onClose} variant="contained" color="primary">
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
