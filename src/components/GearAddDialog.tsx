import React, {useState} from "react";
import {
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    TextField,
    Alert,
    Stack,
    Box,
    FormControlLabel,
    Switch
} from "@mui/material";
import {useGear} from "../providers/GearProvider";
import {BlurBackDrop} from "./HelperComponents";

type GearAddDialogProps = {
    open: boolean;
    onClose: () => void;
};

const GearAddDialog: React.FC<GearAddDialogProps> = ({open, onClose}) => {
    const [gearName, setGearName] = useState("");
    const [description, setDescription] = useState<string | null>(null);
    const [notes, setNotes] = useState<string | null>(null);
    const [isStaffGear, setIsStaffGear] = useState(false);
    const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);
    const [submitSuccessMessage, setSubmitSuccessMessage] = useState<string | null>(null);

    const handleClose = () => {
        onClose();
    };

    const {handleGearAdd, gearData} = useGear();

    const handleValidation = (): boolean => {
        if (!gearName) {
            setSubmitErrorMessage("Gear name is required.");
            setErrorMessageTimeout();
            return false;
        }

        const isDuplicateGearName = gearData.some(
            (gearItem) => gearItem.gear_name.toLowerCase() === gearName.trim().toLowerCase()
        );

        if (isDuplicateGearName) {
            setSubmitErrorMessage("A gear item with this name already exists.");
            setErrorMessageTimeout();
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!handleValidation()) return;

        try {
            await handleGearAdd({
                gear_name: gearName.trim(),
                rfid: null,
                description,
                notes,
                is_staff_gear: isStaffGear
            });
            setSubmitSuccessMessage(`${gearName} added successfully`);
            setGearName("");
            setDescription("");
            setNotes("");
            setIsStaffGear(false);
            // Close the alert after 5 seconds
            setTimeout(() => {
                setSubmitSuccessMessage(null);
            }, 5000);
        } catch (error: any) {
            // Handle error if gear addition fails
            console.error(error);
            setSubmitErrorMessage("Adding gear failed. Contact tech support.");
            setErrorMessageTimeout();
        }
    };

    const setErrorMessageTimeout = () => {
        setTimeout(() => {
            setSubmitErrorMessage(null);
        }, 5000); // 5000 milliseconds (5 seconds)
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={"sm"}
            slots={{backdrop: BlurBackDrop}}
            slotProps={{
                backdrop: {
                    open: open,
                    onClose: handleClose
                }
            }}
        >
            <DialogTitle>Add New Gear</DialogTitle>
            <Box p={2}>
                <TextField
                    label="Gear Name"
                    value={gearName}
                    onChange={(e) => setGearName(e.target.value)}
                    fullWidth
                    className="m-2 pr-5"
                />
                <TextField
                    label="Information"
                    value={description || ""}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    placeholder="Brand, size, tent type, degrees, or other quick details"
                    className="m-2 pr-5"
                />
                <TextField
                    label="Notes (Missing, Broken, etc.)"
                    value={notes || ""}
                    onChange={(e) => setNotes(e.target.value)}
                    fullWidth
                    placeholder="Missing, Broken, Person said they lost it, etc."
                    className="m-2 pr-5"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={isStaffGear}
                            onChange={(event) => setIsStaffGear(event.target.checked)}
                        />
                    }
                    label="Staff Gear"
                    className="m-2"
                />
            </Box>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Add
                </Button>
            </DialogActions>
            {submitErrorMessage && (
                <Stack sx={{width: "100%"}} spacing={2}>
                    <Alert severity="error">{submitErrorMessage}</Alert>
                </Stack>
            )}
            {submitSuccessMessage && (
                <Stack sx={{width: "100%"}} spacing={2}>
                    <Alert severity="success">{submitSuccessMessage}</Alert>
                </Stack>
            )}
        </Dialog>
    );
};

export default GearAddDialog;
