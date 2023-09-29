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
import {useGear} from "src/providers/GearProvider";
import {BlurBackDrop} from "./HelperComponents";

type GearRemoveDialogProps = {
    open: boolean;
    onClose: () => void;
};

const GearRemoveDialog: React.FC<GearRemoveDialogProps> = ({open, onClose}) => {
    const {retrieveGearItem, handleGearDelete, gearRowSelectionModel} = useGear();

    const handleClose = () => {
        onClose();
    };

    const gearsToDelete = gearRowSelectionModel.map((id) => retrieveGearItem(id.toString()));

    async function handleConfirmDelete() {
        await handleGearDelete(gearsToDelete);
        handleClose();
    }

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
                Confirm Deletion
            </DialogTitle>

            <List sx={{pt: 0, px: 2}}>
                {gearsToDelete.map((gear) => (
                    <ListItem key={gear._id}>
                        <Typography color="textSecondary">{gear.gear_name}</Typography>
                    </ListItem>
                ))}
            </List>

            <DialogActions>
                <Button onClick={handleClose} variant="contained" color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirmDelete} variant="contained" color="error">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GearRemoveDialog;
