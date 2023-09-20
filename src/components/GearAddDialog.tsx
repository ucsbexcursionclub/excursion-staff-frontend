import React, {useState} from "react";
import {Dialog, DialogTitle, DialogActions, Button, TextField} from "@mui/material";
import {useGear} from "src/providers/GearProvider";

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
    const [rfid, setRfid] = useState<number | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [notes, setNotes] = useState<string | null>(null);

    const {handleGearAdd} = useGear();

    const handleSubmit = () => {
        if (!gearName || !rfid) return; //TODO: User feedback for missing fields
        handleGearAdd({
            gear_name: gearName,
            rfid,
            description,
            notes
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"sm"}>
            <DialogTitle>Add New Gear</DialogTitle>
            <div>
                <TextField
                    label="Gear Name"
                    value={gearName}
                    onChange={(e) => setGearName(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="RFID"
                    value={rfid || ""}
                    onChange={(e) => setRfid(Number(e.target.value))}
                    fullWidth
                />
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
                <Button onClick={onClose} color="primary">
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
