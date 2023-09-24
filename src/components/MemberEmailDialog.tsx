import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import {useMembers} from "src/providers/MembersProvider";
import TextField from "@mui/material/TextField";

type MemberEmailDialogProps = {
    open: boolean;
    onClose: () => void;
    screenwidth: number; // Custom screen width parameter
};

const MemberEmailDialog: React.FC<MemberEmailDialogProps> = ({open, onClose, screenwidth}) => {
    const {retrieveMemberItem, memberRowSelectionModel} = useMembers();

    if (memberRowSelectionModel.length === 0) {
        return (
            <Dialog open={open} onClose={onClose}>
                <DialogContent>
                    <Typography>You must select a member to copy emails.</Typography>
                </DialogContent>
            </Dialog>
        );
    }

    const memberEmails = memberRowSelectionModel.map((id) => {
        const member = retrieveMemberItem(id.toString());
        return member?.email || ""; // Return the email or an empty string if member not found
    });

    const emailsJoined = memberEmails.join(", "); // Join emails with commas

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

export default MemberEmailDialog;
