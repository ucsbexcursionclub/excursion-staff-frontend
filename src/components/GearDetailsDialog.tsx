// GearDetailsDialog.tsx
import React, {useEffect, useState} from "react";
import {
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    Typography,
    TextField,
    List,
    ListItem
} from "@mui/material";
import {GearProps} from "src/utils/types";
import {useData} from "src/utils/DataProvider";

type GearDetailsDialogProps = {
    open: boolean;
    onClose: () => void;
    gear: GearProps | null;
};

/**
 * TODO: show checkout history of users
 * TODO: be able to edit all gear properties
 */

const GearDetailsDialog: React.FC<GearDetailsDialogProps> = ({open, onClose, gear}) => {
    const [notes, setNotes] = useState(gear?.notes || "");
    const [initialNotes, setInitialNotes] = useState(gear?.notes || "");

    const {handleGearUpdate} = useData();

    useEffect(() => {
        setNotes(gear?.notes || "");
        setInitialNotes(gear?.notes || "");
    }, [gear]);

    const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNotes(event.target.value);
    };

    const handleNotesBlur = async () => {
        // Only update if the notes have changed
        if (notes !== initialNotes) {
            try {
                handleGearUpdate({...gear, notes});
            } catch (error) {
                console.error("Failed to update notes:", error);
            }
        }
    };

    if (!gear) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"sm"}>
            <DialogTitle sx={{px: 3, fontWeight: "bold"}}>{gear.gear_name} Details</DialogTitle>
            <List sx={{pt: 0, px: 2}}>
                <ListItem>
                    <Typography>
                        <strong>RFID:</strong> {gear.rfid}
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography>
                        <strong>Date Added:</strong>{" "}
                        {new Date(gear.date_added).toLocaleDateString()}
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography>
                        <strong>Missing:</strong> {gear.is_missing ? "Yes" : "No"}
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography>
                        <strong>Broken:</strong> {gear.is_broken ? "Yes" : "No"}
                    </Typography>
                </ListItem>
                <ListItem sx={{pb: 2}}>
                    <Typography>
                        <strong>Description:</strong> {gear.description}
                    </Typography>
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
                        onBlur={handleNotesBlur}
                    />
                </ListItem>
            </List>

            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GearDetailsDialog;
