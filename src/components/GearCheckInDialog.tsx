import React from "react";
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

type GearCheckInDialogProps = {
    open: boolean;
    onClose: () => void;
};

const GearCheckInDialog: React.FC<GearCheckInDialogProps> = ({open, onClose}) => {
    const {retrieveGearItem, handleGearCheckin, gearRowSelectionModel} = useGear();

    const handleClose = () => {
        onClose();
    };

    const gearsToCheckIn = gearRowSelectionModel
        .map((id) => retrieveGearItem(id.toString()))
        .filter(Boolean) as GearProps[];

    const handleConfirmCheckIn = async () => {
        await handleGearCheckin(gearsToCheckIn);
        handleClose();
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
                Confirm Check In
            </DialogTitle>

            <List sx={{pt: 0, px: 2}}>
                {gearsToCheckIn.map((gear) => (
                    <ListItem key={gear._id}>
                        <Typography color="textSecondary">{gear.gear_name}</Typography>
                    </ListItem>
                ))}
            </List>

            <DialogActions>
                <Button onClick={handleClose} variant="contained" color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirmCheckIn} variant="contained" color="primary">
                    Check In
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GearCheckInDialog;
