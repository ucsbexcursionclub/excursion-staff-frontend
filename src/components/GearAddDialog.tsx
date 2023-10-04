import React, {useState} from "react";
import {Dialog, DialogTitle, DialogActions, Button, TextField} from "@mui/material";
import {useGear} from "src/providers/GearProvider";
import {BlurBackDrop} from "./HelperComponents";

type GearAddDialogProps = {
    open: boolean;
    onClose: () => void;
};

/*
TODO: Need to add category, with option to add new category if it doesn't exist. Should be like an Autocomplete that fetches all categories in db
use Autocomplete MUI component
*/

const GearAddDialog: React.FC<GearAddDialogProps> = ({open, onClose}) => {
    const [gearName, setGearName] = useState("");
    const [rfid, setRfid] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [notes, setNotes] = useState<string | null>(null);

    const handleClose = () => {
        onClose();
    };

    const {handleGearAdd, retrieveGearItemByRFID} = useGear();

    const handleValidation = (): boolean => {
        if (!gearName) return false;

        if (rfid !== "" && rfid !== null) {
            if (retrieveGearItemByRFID(rfid)) return false;
        }
        return true;
    };

    const handleSubmit = () => {
        //TODO: User feedback for missing fields

        if (!handleValidation()) return false;

        setRfid(rfid === "" ? null : rfid);

        handleGearAdd({
            gear_name: gearName,
            rfid,
            description,
            notes
        });
        handleClose();
    };

    const handleRfidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value === "" || /^[0-9]+$/.test(value)) {
            setRfid(value);
        }
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
            <div>
                <TextField
                    label="Gear Name"
                    value={gearName}
                    onChange={(e) => setGearName(e.target.value)}
                    fullWidth
                />
                <TextField label="RFID" value={rfid || ""} onChange={handleRfidChange} fullWidth />
                <TextField
                    label="Description (optional)"
                    value={description || ""}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Notes (optional)"
                    value={notes || ""}
                    onChange={(e) => setNotes(e.target.value)}
                    fullWidth
                />
            </div>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GearAddDialog;
