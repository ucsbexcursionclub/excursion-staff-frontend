import React, {useState} from "react";
import {
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Button,
    Typography,
    List,
    ListItem,
    Alert
} from "@mui/material";
import MembersAutoComplete from "./MembersAutoComplete";
import {MemberProps} from "../utils/types";
import {useGear} from "../providers/GearProvider";
import {BlurBackDrop} from "./HelperComponents";
import {useReservations} from "../providers/ReservationProvider";

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
    const {retrieveReservationsByMemberId} = useReservations();
    const [overdueGearAlert, setOverdueGearAlert] = useState<string | null>(null);

    const gearsToCheckOut = gearRowSelectionModel.map((id) => retrieveGearItem(id.toString()));

    const [selectedMember, setSelectedMember] = useState<MemberProps | null>(null);

    const [error, setError] = useState<boolean>(false);

    const handleClose = () => {
        onClose();
    };

    const handleConfirmCheckOut = async () => {
        if (selectedMember) {
            const overdueReservations = await retrieveReservationsByMemberId(selectedMember._id);

            if (overdueReservations.length > 0) {
                // Display an alert for overdue gear reservations
                const overdueGearAlert = `${selectedMember.name} has overdue gear reservations:\n`;
                const overdueGearItems = overdueReservations.map((reservation) => {
                    // Map each reserved_gear item
                    const overdueGearItemNames = reservation.reserved_gear.map((gearItemId) => {
                        const gearItem = retrieveGearItem(gearItemId);
                        const gearItemName = gearItem ? gearItem.gear_name : "Unknown Gear";
                        return gearItemName;
                    });

                    return `${overdueGearItemNames.join(", ")} (Due Date: ${new Date(
                        reservation.due_date
                    ).toLocaleDateString()})`;
                });
                const overdueGearMessage = overdueGearAlert + overdueGearItems.join("\n");
                setOverdueGearAlert(overdueGearMessage);
                console.log(overdueGearMessage);
            } else {
                // No overdue gear reservations, proceed with checkout
                await handleGearCheckout(selectedMember, gearsToCheckOut);
                handleClose();
            }
        } else {
            setError(true);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={"xs"}
            slots={{backdrop: BlurBackDrop}}
            slotProps={{
                backdrop: {
                    open: open,
                    onClose: handleClose
                }
            }}
        >
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
                <Button onClick={handleClose} variant="contained" color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirmCheckOut} variant="contained" color="primary">
                    Check Out
                </Button>
            </DialogActions>
            {overdueGearAlert && (
                <Alert severity="error" sx={{mt: 2}}>
                    {overdueGearAlert}
                </Alert>
            )}
        </Dialog>
    );
};

export default GearCheckOutDialog;
