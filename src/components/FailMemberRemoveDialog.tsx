import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {BlurBackDrop} from "./HelperComponents";

type FailMemberRemoveDialogProps = {
    open: boolean;
    onClose: () => void;
};

export default function FailMemberRemoveDialog({open, onClose}: FailMemberRemoveDialogProps) {
    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            slots={{backdrop: BlurBackDrop}}
            slotProps={{
                backdrop: {
                    open: open,
                    onClose: handleClose
                }
            }}
        >
            <DialogTitle id="alert-dialog-title">Error</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    You must select at least one row of members before pressing Remove Member(s).
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" autoFocus>
                    Okay
                </Button>
            </DialogActions>
        </Dialog>
    );
}
