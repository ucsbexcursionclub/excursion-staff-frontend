import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type RemoveMemberDialogProps = {
    open: boolean;
    onClose: () => void;
    onOpen: () => void;
    onConfirm: () => void;
    memberNames: string[]; // Array of member names to display in the confirmation message
};

const RemoveMemberDialog: React.FC<RemoveMemberDialogProps> = ({
    open,
    onClose,
    onConfirm,
    memberNames
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Remove Member(s)</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to remove the following member(s)?
                    <br />
                    {memberNames.join(", ")}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="primary" variant="contained">
                    Remove
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RemoveMemberDialog;
