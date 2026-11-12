import React, {useState} from "react";
import {
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    Typography,
    List,
    ListItem
} from "@mui/material";
import {useGear} from "../providers/GearProvider";
import {BlurBackDrop} from "./HelperComponents";
import {GearProps} from "../utils/types";

type GearMarkContactedDialogProps = {
    open: boolean;
    onClose: () => void;
};

const GearMarkContactedDialog: React.FC<GearMarkContactedDialogProps> = ({open, onClose}) => {
    const {retrieveGearItem, handleGearMarkContacted, gearRowSelectionModel} = useGear();
    const [isSaving, setIsSaving] = useState(false);

    const selectedGear = gearRowSelectionModel
        .map((id) => retrieveGearItem(id.toString()))
        .filter(Boolean) as GearProps[];

    // Last contacted lives on the reservation, so only checked out gear can be updated
    const gearToMark = selectedGear.filter((gear) => gear.current_reservation);
    const skippedCount = selectedGear.length - gearToMark.length;

    const handleConfirm = async () => {
        setIsSaving(true);
        try {
            await handleGearMarkContacted(gearToMark);
        } finally {
            setIsSaving(false);
        }
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth={true}
            maxWidth={"xs"}
            slots={{backdrop: BlurBackDrop}}
            slotProps={{
                backdrop: {
                    open: open,
                    onClose: onClose
                }
            }}
        >
            <DialogTitle sx={{px: 3, fontWeight: "bold", fontSize: "24px"}}>
                Mark Contacted Today
            </DialogTitle>

            <Typography color="textSecondary" sx={{px: 3, pb: 1}}>
                Last contacted will be set to today for:
            </Typography>

            <List sx={{pt: 0, px: 2}}>
                {gearToMark.map((gear) => (
                    <ListItem key={gear._id}>
                        <Typography color="textSecondary">
                            {gear.gear_name}
                            {gear.memberDetails?.name ? ` — ${gear.memberDetails.name}` : ""}
                        </Typography>
                    </ListItem>
                ))}
            </List>

            {skippedCount > 0 && (
                <Typography color="textSecondary" sx={{px: 3, pb: 1, fontSize: "14px"}}>
                    {skippedCount} selected {skippedCount === 1 ? "item is" : "items are"} not
                    checked out and will be skipped.
                </Typography>
            )}

            <DialogActions>
                <Button onClick={onClose} variant="contained" color="primary" disabled={isSaving}>
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="primary"
                    disabled={isSaving}
                >
                    Mark Contacted
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GearMarkContactedDialog;
