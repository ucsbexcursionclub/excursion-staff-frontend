import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import {useStaff} from "src/providers/StaffProvider"; // Import the staff provider
import TextField from "@mui/material/TextField";

type StaffEmailDialogProps = {
    open: boolean;
    onClose: () => void;
    screenwidth: number; // Custom screen width parameter
};

const StaffEmailDialog: React.FC<StaffEmailDialogProps> = ({open, onClose, screenwidth}) => {
    const {retrieveStaffItem, staffRowSelectionModel} = useStaff(); // Use the staff provider

    if (staffRowSelectionModel.length === 0) {
        return (
            <Dialog open={open} onClose={onClose}>
                <DialogContent>
                    <Typography>You must select a staff member to copy emails.</Typography>
                </DialogContent>
            </Dialog>
        );
    }

    const staffEmails = staffRowSelectionModel.map((id) => {
        const staff = retrieveStaffItem(id.toString());
        return staff?.memberDetails?.email || ""; // Return the email or an empty string if staff member not found
    });

    const emailsJoined = staffEmails.join(", "); // Join emails with commas

    const maxWidth = `${(screenwidth / 100) * 80}vw`;

    return (
        <Dialog open={open} onClose={onClose} style={{maxWidth}}>
            <DialogContent>
                <TextField
                    fullWidth
                    multiline
                    value={emailsJoined}
                    inputProps={{
                        style: {
                            overflowWrap: "break-word",
                            width: maxWidth
                        }
                    }}
                />
            </DialogContent>
        </Dialog>
    );
};

export default StaffEmailDialog;
