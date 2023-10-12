import React, {useCallback, useEffect, useState} from "react";
import {
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    TextField,
    List,
    ListItem,
    Box,
    Typography,
    DialogContent
} from "@mui/material";
import {MemberProps} from "../utils/types";
import {useMembers} from "../providers/MembersProvider";
import {BlurBackDrop} from "./HelperComponents";
import {capitalizeFirstLetter} from "../utils/utils";

type MemberDetailsDialogProps = {
    open: boolean;
    onClose: () => void;
    member: MemberProps | null;
};

const MemberDetailsDialog: React.FC<MemberDetailsDialogProps> = ({open, onClose, member}) => {
    const [notes, setNotes] = useState(member?.notes || "");
    const [initialNotes, setInitialNotes] = useState(member?.notes || "");
    const {handleMemberUpdate, retrieveMemberById} = useMembers();

    const handleClose = () => {
        onClose();
    };

    useEffect(() => {
        setNotes(member?.notes || "");
        setInitialNotes(member?.notes || "");
    }, [member]);

    const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNotes(event.target.value);
    };

    const signedUpBy = useCallback(() => {
        const staffName = member && retrieveMemberById(member.signed_up_by)?.name;

        return staffName ? capitalizeFirstLetter(staffName) : "N/A";
    }, [member]);

    if (!member) return null;

    const handleNotesBlur = async () => {
        if (notes !== initialNotes) {
            try {
                handleMemberUpdate({...member, notes});
            } catch (error) {
                console.error("Failed to update notes:", error);
            }
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={"sm"}
            scroll={"paper"}
            slots={{backdrop: BlurBackDrop}}
            slotProps={{
                backdrop: {
                    open: open,
                    onClose: handleClose
                }
            }}
        >
            <DialogTitle sx={{px: 3, fontWeight: "bold"}}>{member.name} Details</DialogTitle>
            <Box sx={{borderBottom: 1, borderColor: "divider"}}></Box>
            <DialogContent dividers={true}>
                <List sx={{pt: 0, px: 2}}>
                    <ListItem>
                        <Typography>
                            <strong>Email: </strong> {member.email}
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography>
                            <strong>Phone: </strong> {member.phone_number}
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography>
                            <strong>Membership Expiration: </strong>{" "}
                            {new Date(member.membership_expiration_date).toLocaleDateString()}
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography>
                            <strong>Signed Up By: </strong> {signedUpBy()}
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography>
                            <strong>
                                {" "}
                                {member.is_new_member ? "Date Joined:" : "Date Renewed:"}
                            </strong>{" "}
                            {new Date(member.join_datetime).toLocaleDateString()}
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography>
                            <strong>
                                {member.is_new_member ? "New Member" : "Returning Member"}
                            </strong>{" "}
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography>
                            <strong>Membership Duration: </strong>
                            {member.membership_duration} days
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <TextField
                            label="Notes"
                            variant="outlined"
                            multiline
                            rows={4}
                            fullWidth
                            value={notes}
                            onChange={handleNotesChange}
                            onBlur={handleNotesBlur}
                        />
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MemberDetailsDialog;
