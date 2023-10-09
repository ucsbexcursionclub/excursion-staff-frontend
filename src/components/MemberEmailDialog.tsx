import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import {useMembers} from "../providers/MembersProvider";
import TextField from "@mui/material/TextField";
import {BlurBackDrop} from "./HelperComponents";
import {Typography} from "@mui/material";
import {useState, useEffect} from "react";

type MemberEmailDialogProps = {
    open: boolean;
    onClose: () => void;
    screenwidth: number; // Custom screen width parameter
    copyEmailOption: string; // Copy email option: 'copySelected', 'copyActive', or 'copyExpired'
};

const MemberEmailDialog: React.FC<MemberEmailDialogProps> = ({
    open,
    onClose,
    screenwidth,
    copyEmailOption
}) => {
    const {retrieveMemberItem, membersData, memberRowSelectionModel} = useMembers();
    const [showDialog, setShowDialog] = useState(false);
    const [showTextDialog, setShowTextDialog] = useState(false);

    useEffect(() => {
        // Check if we should show the dialog based on the conditions
        if (copyEmailOption === "copySelected" && memberRowSelectionModel.length === 0) {
            // If copyEmailOption is "copySelected" and no members are selected, don't show the dialog
            setShowDialog(false);
            setShowTextDialog(true);
        } else {
            setShowDialog(true);
            setShowTextDialog(false);
        }
    }, [copyEmailOption, memberRowSelectionModel]);

    const handleClose = () => {
        onClose();
    };

    let memberEmails: string[] = [];

    if (copyEmailOption === "copySelected" && memberRowSelectionModel.length > 0) {
        memberEmails = memberRowSelectionModel.map((id) => {
            const member = retrieveMemberItem(id.toString());
            return member?.email || ""; // Return the email or an empty string if member not found
        });
    } else {
        // Filter membersData based on the copyEmailOption
        let filteredData = membersData.slice(); // Create a copy of membersData

        switch (copyEmailOption) {
            case "copyActive":
                filteredData = filteredData.filter((row) => {
                    const expirationDate = new Date(row.membership_expiration_date || Infinity);
                    const today = new Date();
                    today.setHours(today.getHours() - 8); // Convert to PST timezone (America/Los_Angeles)
                    return expirationDate >= today || row.membership_expiration_date === null;
                });
                break;
            case "copyExpired":
                filteredData = filteredData.filter((row) => {
                    const expirationDate = new Date(row.membership_expiration_date || Infinity);
                    const today = new Date();
                    today.setHours(today.getHours() - 8); // Convert to PST timezone (America/Los_Angeles)
                    return expirationDate < today && row.membership_expiration_date !== null;
                });
                break;
            // No default case needed as we want to return all members for other options
        }

        memberEmails = filteredData.map((row) => {
            return row.email || "";
        });
    }

    const emailsJoined = memberEmails.join(", "); // Join emails with commas

    const maxWidth = `${(screenwidth / 100) * 80}vw`;

    return (
        <div>
            <Dialog
                open={showDialog && open} // Use showDialog state to control dialog visibility
                onClose={handleClose}
                style={{maxWidth}}
                slots={{backdrop: BlurBackDrop}}
                slotProps={{
                    backdrop: {
                        open: showDialog && open,
                        onClose: handleClose
                    }
                }}
            >
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
            <Dialog
                open={showTextDialog && open} // Use showDialog state to control dialog visibility
                onClose={handleClose}
                style={{maxWidth}}
                slots={{backdrop: BlurBackDrop}}
                slotProps={{
                    backdrop: {
                        open: showTextDialog && open,
                        onClose: handleClose
                    }
                }}
            >
                <DialogContent>
                    <Typography>You must select a member to copy emails.</Typography>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MemberEmailDialog;
