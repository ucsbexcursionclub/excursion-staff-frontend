import React, {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import {useMembers} from "../providers/MembersProvider";
import TextField from "@mui/material/TextField";
import {BlurBackDrop} from "./HelperComponents";

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
    const [emails, setEmails] = useState<string[]>();
    const {retrieveMemberById, membersData, memberRowSelectionModel} = useMembers();

    const handleClose = () => {
        onClose();
    };

    useEffect(() => {
        if (!open) return;

        const today = Date.now();

        let emails;

        switch (copyEmailOption) {
            case "copySelected":
                emails = memberRowSelectionModel
                    .map((id) => retrieveMemberById(id.toString())?.email)
                    .filter(Boolean) as string[];
                break;
            case "copyActive":
                emails = membersData
                    .filter((member) => {
                        if (!member) return false;
                        return member.membership_expiration_date > today;
                    })
                    .map((member) => member.email);
                break;
            case "copyExpired":
                emails = membersData
                    .filter((member) => {
                        if (!member) return false;
                        return member.membership_expiration_date < today;
                    })
                    .map((member) => member.email);
                break;
        }

        setEmails(emails);
    }, [open, copyEmailOption, memberRowSelectionModel, retrieveMemberById, membersData]);

    const maxWidth = `${(screenwidth / 100) * 80}vw`;

    return (
        <Dialog
            open={open} // Use showDialog state to control dialog visibility
            onClose={handleClose}
            style={{maxWidth}}
            slots={{backdrop: BlurBackDrop}}
            slotProps={{
                backdrop: {
                    open: open,
                    onClose: handleClose
                }
            }}
        >
            <DialogContent>
                <TextField
                    fullWidth
                    multiline
                    value={emails?.join(", ")}
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
