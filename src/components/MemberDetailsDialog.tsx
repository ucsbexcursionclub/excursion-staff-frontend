import React, {useEffect, useState} from "react";
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
import {MemberProps} from "src/utils/types";
import {useMembers} from "src/providers/MembersProvider";

type MemberDetailsDialogProps = {
    open: boolean;
    onClose: () => void;
    member: MemberProps | null;
};

const MemberDetailsDialog: React.FC<MemberDetailsDialogProps> = ({open, onClose, member}) => {
    const [notes, setNotes] = useState(member?.notes || "");
    const [initialNotes, setInitialNotes] = useState(member?.notes || "");
    const {handleMemberUpdate} = useMembers();

    useEffect(() => {
        setNotes(member?.notes || "");
        setInitialNotes(member?.notes || "");
    }, [member]);

    const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNotes(event.target.value);
    };

    const handleNotesBlur = async () => {
        if (notes !== initialNotes) {
            try {
                handleMemberUpdate({...member, notes});
            } catch (error) {
                console.error("Failed to update notes:", error);
            }
        }
    };

    if (!member) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"sm"} scroll={"paper"}>
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
                            {member.membership_expiration_date}
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography>
                            <strong>Signed Up By: </strong> {member.signed_up_by}
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
                            <strong>Membership Duration:</strong>
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
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MemberDetailsDialog;
