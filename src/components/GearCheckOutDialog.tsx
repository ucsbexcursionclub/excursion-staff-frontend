import React, {useState, useEffect, useMemo} from "react";
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
import {MemberProps, ReservationProps, GearProps} from "../utils/types";
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
    const {retrieveOpenReservationsByMemberId, retrieveOpenReservationsByGearId} =
        useReservations();
    const [alertMessage, setAlertMessage] = useState<string[]>([]);

    const gearsToCheckOut = useMemo(
        () =>
            gearRowSelectionModel
                .map((id) => retrieveGearItem(id.toString()))
                .filter(Boolean) as GearProps[],
        [gearRowSelectionModel, retrieveGearItem]
    );

    const [selectedMember, setSelectedMember] = useState<MemberProps | null>(null);

    const [error, setError] = useState<boolean>(false);

    const handleClose = () => {
        onClose();
    };

    useEffect(() => {
        setSelectedMember(null);
        setAlertMessage([]);
    }, [open]);

    useEffect(() => {
        const alreadyCheckedOutGears = gearsToCheckOut.filter((gear) => gear.current_reservation);
        const brokenGears = gearsToCheckOut.filter((gear) => gear.is_broken);
        if (open && brokenGears.length > 0) {
            const alertMessage =
                "WARNING: Some gear is marked as broken.\n\n" +
                brokenGears
                    .map((gear) => {
                        const gearItemName = gear.gear_name || "Unknown Gear";
                        return `${gearItemName}\n`;
                    })
                    .join("");

            console.log("triggering");
            setAlertMessage((prevMsg) => [...prevMsg, alertMessage]);
        }
        if (open && alreadyCheckedOutGears.length > 0) {
            const alertMessage =
                "WARNING: Some gear is already checked out. Checking out again will override previous reservation.\n\n" +
                alreadyCheckedOutGears
                    .map((gear) => {
                        const reservation = retrieveOpenReservationsByGearId(gear._id)[0];
                        const gearItemName = gear.gear_name || "Unknown Gear";
                        return `${gearItemName} (Checked out to: ${
                            reservation.memberDetails?.name || "Unknown Member"
                        })\n`;
                    })
                    .join("");

            setAlertMessage((prevMsg) => [...prevMsg, alertMessage]);
        }
    }, [open, gearsToCheckOut, retrieveOpenReservationsByGearId]);

    const handleConfirmCheckOut = async () => {
        if (selectedMember) {
            const openReservations: ReservationProps[] = retrieveOpenReservationsByMemberId(
                selectedMember._id
            );
            const currentDateTime = new Date().getTime();

            const overdueGearItems: {gear: GearProps; due_date: number}[] = [];

            openReservations.map((reservation) => {
                if (reservation.due_date < Date.now()) {
                    reservation.checked_out_gear.map((gearId) => {
                        const gearItem = retrieveGearItem(gearId)!;
                        overdueGearItems.push({gear: gearItem, due_date: reservation.due_date});
                    });
                }
            });

            if (
                selectedMember.membership_expiration_date < currentDateTime &&
                selectedMember.membership_expiration_date !== null
            ) {
                const alertMessage = `${selectedMember.name}'s membership expired on ${new Date(
                    selectedMember.membership_expiration_date
                ).toLocaleDateString()} `;

                setAlertMessage((prevMsg) => [...prevMsg, alertMessage]);
            } else if (overdueGearItems.length > 0) {
                // Display an alert for overdue gear reservations
                const alertMessage =
                    `${selectedMember.name} has overdue gear reservations:\n\n` +
                    overdueGearItems.map(({gear, due_date}) => {
                        const gearItemName = gear ? gear.gear_name : "Unknown Gear";
                        return `${gearItemName} (Due Date: ${new Date(
                            due_date
                        ).toLocaleDateString()})\n`;
                    });

                setAlertMessage((prevMsg) => [...prevMsg, alertMessage]);
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

            <DialogContent className="min-h-80">
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

            <DialogActions className="mb-2">
                <Button onClick={handleClose} variant="contained" color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirmCheckOut} variant="contained" color="primary">
                    Check Out
                </Button>
            </DialogActions>
            {alertMessage.map((alert, index) => (
                <Alert key={index} severity="error" className="whitespace-pre-wrap">
                    {alert}
                </Alert>
            ))}
        </Dialog>
    );
};

export default GearCheckOutDialog;
