import React, {useEffect, useState} from "react";
import {
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    TextField,
    List,
    ListItem,
    Tabs,
    Tab,
    Box,
    Typography,
    DialogContent
} from "@mui/material";
import {GearProps} from "src/utils/types";
import {useGear} from "src/providers/GearProvider";
import CheckoutHistory from "./CheckoutHistory";

type GearDetailsDialogProps = {
    open: boolean;
    onClose: () => void;
    gear: GearProps | null;
};

const GearDetailsDialog: React.FC<GearDetailsDialogProps> = ({open, onClose, gear}) => {
    const [notes, setNotes] = useState(gear?.notes || "");
    const [initialNotes, setInitialNotes] = useState(gear?.notes || "");
    const [value, setValue] = useState(0);

    const {handleGearUpdate} = useGear();

    useEffect(() => {
        setNotes(gear?.notes || "");
        setInitialNotes(gear?.notes || "");
    }, [gear]);

    useEffect(() => {
        open && setValue(0);
    }, [open]);

    const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNotes(event.target.value);
    };

    const handleNotesBlur = async () => {
        if (notes !== initialNotes) {
            try {
                handleGearUpdate({...gear, notes});
            } catch (error) {
                console.error("Failed to update notes:", error);
            }
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    if (!gear) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"sm"} scroll={"paper"}>
            <DialogTitle sx={{px: 3, fontWeight: "bold"}}>{gear.gear_name} Details</DialogTitle>
            <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                <Tabs value={value} onChange={handleTabChange} aria-label="gear details tabs">
                    <Tab label="Details" {...a11yProps(0)} />
                    <Tab label="History" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <DialogContent dividers={true}>
                <CustomTabPanel value={value} index={0}>
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
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <CheckoutHistory gearId={gear._id} />
                </CustomTabPanel>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            style={{height: "50vh"}}
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{p: 3}}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`
    };
}

export default GearDetailsDialog;
