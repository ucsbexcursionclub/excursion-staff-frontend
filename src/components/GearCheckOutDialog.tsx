import React, {useState} from "react";
import {
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Button,
    Typography,
    List,
    ListItem
} from "@mui/material";
import MembersAutoComplete from "./MembersAutoComplete";
import {MemberProps} from "src/utils/types";
import {useGear} from "src/providers/GearProvider";

type GearCheckOutDialogProps = {
    open: boolean;
    onClose: () => void;
};

/*
TODO: if gear is already checked out to someone else: overwrite it with this new check out (because we're doing this in person so that means gear was forgotten to check back in and have a message that says "[gear name] was never checked back in! but is now checked out to [new name]"
NOTES: Already overwrites, but need a feedback system
*/

/*
TODO: handle overwrites to close reservations automatically with some notes maybe
*/

const GearCheckOutDialog: React.FC<GearCheckOutDialogProps> = ({open, onClose}) => {
    const {retrieveGearItem, handleGearCheckout, gearRowSelectionModel} = useGear();

    const gearsToCheckOut = gearRowSelectionModel.map((id) => retrieveGearItem(id.toString()));

    const [selectedMember, setSelectedMember] = useState<MemberProps | null>(null);

    const [error, setError] = useState<boolean>(false);

    const handleConfirmCheckOut = async () => {
        if (selectedMember) {
            await handleGearCheckout(selectedMember, gearsToCheckOut);
            onClose();
        } else {
            setError(true);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"xs"}>
            <DialogTitle sx={{px: 3, fontWeight: "bold", fontSize: "24px"}}>
                Check Out Gear
            </DialogTitle>

            <DialogContent>
                <Typography gutterBottom>
                    {`Please confirm the gear items you want to check out and provide the member's
                    name:`}
                </Typography>

                <List sx={{pt: 0, px: 2}}>
                    {gearsToCheckOut.map((gear) => (
                        <ListItem key={gear._id}>
                            <Typography color="textSecondary">{gear.gear_name}</Typography>
                        </ListItem>
                    ))}
                </List>

                <MembersAutoComplete
                    error={error}
                    setError={setError}
                    setMemberVal={setSelectedMember}
                    memberVal={selectedMember}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="contained" color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirmCheckOut} variant="contained" color="primary">
                    Check Out
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GearCheckOutDialog;
