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
    DialogContent,
    FormControlLabel,
    MenuItem,
    Switch
} from "@mui/material";
import {MemberProps} from "../utils/types";
import {useMembers} from "../providers/MembersProvider";
import {BlurBackDrop} from "./HelperComponents";
import {capitalizeFirstLetter, convertToMUIDate} from "../utils/utils";
import {useSnackbar} from "../providers/SnackBarProvider";

type MemberDetailsDialogProps = {
    open: boolean;
    onClose: () => void;
    member: MemberProps | null;
};

const MemberDetailsDialog: React.FC<MemberDetailsDialogProps> = ({open, onClose, member}) => {
    const [name, setName] = useState<string>(member?.name || "");
    const [phoneNumber, setPhone] = useState<string>(member?.phone_number || "");
    const [email, setEmail] = useState<string>(member?.email || "");
    const [notes, setNotes] = useState(member?.notes || "");
    const [membershipDuration, setMembershipDuration] = useState<number>(
        member?.membership_duration || 365
    );
    const [membershipExpirationDate, setMembershipExpirationDate] = useState(
        member?.membership_expiration_date ? convertToMUIDate(member.membership_expiration_date) : ""
    );
    const [neverExpires, setNeverExpires] = useState(!member?.membership_expiration_date);
    const [excludeFromStats, setExcludeFromStats] = useState(!!member?.exclude_from_stats);
    const {handleMemberUpdate, retrieveMemberById} = useMembers();

    const {addNotification} = useSnackbar();

    const handleClose = () => {
        onClose();
    };

    useEffect(() => {
        setName(member?.name || "");
        setEmail(member?.email || "");
        setPhone(member?.phone_number || "");
        setNotes(member?.notes || "");
        setMembershipDuration(member?.membership_duration || 365);
        setMembershipExpirationDate(
            member?.membership_expiration_date
                ? convertToMUIDate(member.membership_expiration_date)
                : ""
        );
        setNeverExpires(!member?.membership_expiration_date);
        setExcludeFromStats(!!member?.exclude_from_stats);
    }, [member]);

    const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNotes(event.target.value);
    };

    const signedUpBy = useCallback(() => {
        const staffName = member && retrieveMemberById(member.signed_up_by)?.name;

        return staffName ? capitalizeFirstLetter(staffName) : "N/A";
    }, [member, retrieveMemberById]);

    if (!member) return null;

    const handleFormSubmit = async () => {
        if (!member) {
            handleClose();
            return;
        }

        const modifiedMember: MemberProps = {
            ...member,
            name,
            email,
            phone_number: phoneNumber,
            notes,
            membership_duration: membershipDuration,
            membership_expiration_date: neverExpires
                ? null
                : membershipExpirationDate
                  ? new Date(membershipExpirationDate).getTime()
                  : member.membership_expiration_date,
            exclude_from_stats: excludeFromStats
        };
        const updatedMember = await handleMemberUpdate(modifiedMember);

        handleClose();
        if (updatedMember) {
            addNotification({message: "Successfully updated member!", type: "success"});
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
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            variant="outlined"
                            className="w-full mb-4"
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                            className="w-full mb-4"
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            label="Phone"
                            value={phoneNumber}
                            onChange={(e) => setPhone(e.target.value)}
                            variant="outlined"
                            className="w-full mb-4"
                        />
                    </ListItem>
                    <ListItem>
                        <Typography>
                            <strong>Membership Expiration: </strong>{" "}
                            {member.membership_expiration_date
                                ? new Date(member.membership_expiration_date).toLocaleDateString()
                                : "Never Expires"}
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
                        <TextField
                            select
                            label="Membership Duration"
                            value={membershipDuration}
                            onChange={(e) => setMembershipDuration(Number(e.target.value))}
                            variant="outlined"
                            className="w-full mb-4"
                        >
                            <MenuItem value={90}>90 Days</MenuItem>
                            <MenuItem value={180}>180 Days</MenuItem>
                            <MenuItem value={365}>365 Days</MenuItem>
                        </TextField>
                    </ListItem>
                    <ListItem>
                        <TextField
                            label="Membership Expiration"
                            type="date"
                            value={membershipExpirationDate}
                            onChange={(e) => setMembershipExpirationDate(e.target.value)}
                            variant="outlined"
                            className="w-full mb-4"
                            disabled={neverExpires}
                            InputLabelProps={{shrink: true}}
                        />
                    </ListItem>
                    <ListItem>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={neverExpires}
                                    onChange={(e) => setNeverExpires(e.target.checked)}
                                />
                            }
                            label="Never Expires"
                        />
                    </ListItem>
                    <ListItem>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={excludeFromStats}
                                    onChange={(e) => setExcludeFromStats(e.target.checked)}
                                />
                            }
                            label="Exclude From Stats"
                        />
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
                        />
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" variant="outlined">
                    Close
                </Button>
                <Button onClick={handleFormSubmit} color="primary" variant="contained">
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MemberDetailsDialog;
