import React, {useEffect, useState} from "react";
import {
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    TextField,
    Tabs,
    Tab,
    Box,
    Typography,
    DialogContent,
    FormControlLabel,
    Switch
} from "@mui/material";
import {GearProps} from "../utils/types";
import CheckoutHistory from "./CheckoutHistory";
import {BlurBackDrop} from "./HelperComponents";
import {FormControl} from "@mui/material";
import {useGear} from "../providers/GearProvider";
import {useReservations} from "../providers/ReservationProvider";
import {convertToMUIDate} from "../utils/utils";

type GearDetailsDialogProps = {
    open: boolean;
    onClose: () => void;
    gear: GearProps | null;
};

const GearDetailsDialog: React.FC<GearDetailsDialogProps> = ({open, onClose, gear}) => {
    const [tabValue, setTabValue] = useState(0);

    const [rfid, setRfid] = useState<string>(gear?.rfid || "");
    const [lastContacted, setLastContacted] = useState<number | null>(
        gear?.reservationDetails?.last_contacted || null
    );
    const [isMissing, setIsMissing] = useState<boolean>(gear?.is_missing || false);
    const [isBroken, setIsBroken] = useState<boolean>(gear?.is_broken || false);
    const [description, setDescription] = useState<string>(gear?.description || "");
    const [notes, setNotes] = useState<string>(gear?.notes || "");

    const {handleGearUpdate} = useGear();
    const {handleReservationUpdate} = useReservations();

    const handleClose = () => {
        onClose();
    };

    useEffect(() => {
        open && setTabValue(0);
    }, [open]);

    useEffect(() => {
        setIsMissing(gear?.is_missing || false);
        setIsBroken(gear?.is_broken || false);
        setRfid(gear?.rfid || "");
        setLastContacted(gear?.reservationDetails?.last_contacted || null);
        setDescription(gear?.description || "");
        setNotes(gear?.notes || "");
    }, [gear]);

    const handleFormSubmit = async () => {
        if (!gear) {
            handleClose();
            return;
        }

        if (gear.reservationDetails) {
            const oldLastContacted = gear.reservationDetails?.last_contacted;

            if (lastContacted && lastContacted !== oldLastContacted) {
                handleReservationUpdate({
                    ...gear.reservationDetails,
                    last_contacted: lastContacted
                });
            }
        }

        const modifiedGear: GearProps = {
            ...gear,
            rfid,
            is_missing: isMissing,
            is_broken: isBroken,
            description,
            notes
        };

        await handleGearUpdate(modifiedGear);

        handleClose();
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (!gear) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={"sm"}
            scroll={"paper"}
            slots={{backdrop: BlurBackDrop}}
            slotProps={{
                backdrop: {
                    open: open,
                    onClose: handleClose
                }
            }}
        >
            <DialogTitle sx={{px: 3, fontWeight: "bold"}}>{gear.gear_name} Details</DialogTitle>
            <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="gear details tabs">
                    <Tab label="Details" {...a11yProps(0)} />
                    <Tab label="History" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <DialogContent dividers={true}>
                <CustomTabPanel value={tabValue} index={0}>
                    <Typography variant="h6" sx={{marginBottom: "1rem"}}>
                        <strong>Item Details</strong>
                    </Typography>
                    <FormControl className="w-full">
                        <TextField
                            label="RFID"
                            value={rfid}
                            onChange={(e) => setRfid(e.target.value)}
                            variant="outlined"
                            className="w-full mb-4"
                        />
                        <TextField
                            label="Date Added"
                            type="date"
                            defaultValue={convertToMUIDate(gear.date_added)}
                            disabled
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true
                            }}
                            className="w-full mb-4"
                        />
                        <div className="flex space-x-2">
                            {lastContacted ? (
                                <TextField
                                    key={0}
                                    label="Date Last Contacted (Reserving Member)"
                                    disabled={Boolean(!gear.reservationDetails)}
                                    type={"date"}
                                    onChange={
                                        (e) => setLastContacted(new Date(e.target.value).getTime()) //might be wrong
                                    }
                                    value={convertToMUIDate(lastContacted)}
                                    variant="outlined"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    className="w-full mb-4"
                                />
                            ) : (
                                <TextField
                                    key={1}
                                    label="Date Last Contacted (Reserving Member)"
                                    disabled={Boolean(!gear.reservationDetails)}
                                    type={"date"}
                                    onChange={
                                        (e) => setLastContacted(new Date(e.target.value).getTime()) //might be wrong
                                    }
                                    variant="outlined"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    className="w-full mb-4"
                                />
                            )}
                            <Button
                                className="mb-4"
                                disabled={Boolean(!gear.reservationDetails)}
                                onClick={() => setLastContacted(Date.now())}
                                color="primary"
                                variant="outlined"
                            >
                                Today
                            </Button>
                        </div>
                        <div className="flex">
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isMissing}
                                        onChange={(e) => setIsMissing(e.target.checked)}
                                        name="isMissing"
                                    />
                                }
                                label="Missing"
                                className="mb-4"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isBroken}
                                        onChange={(e) => setIsBroken(e.target.checked)}
                                        name="isBroken"
                                    />
                                }
                                label="Broken"
                                className="mb-4"
                            />
                        </div>
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            variant="outlined"
                            rows={3}
                            className="w-full mb-4"
                            multiline
                        />
                        <TextField
                            label="Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            variant="outlined"
                            className="w-full mb-4"
                            rows={5}
                            multiline
                        />
                    </FormControl>
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={1}>
                    <CheckoutHistory gearId={gear._id} />
                </CustomTabPanel>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" variant="outlined">
                    Close
                </Button>
                <Button onClick={handleFormSubmit} color="primary" variant="contained">
                    Update
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
