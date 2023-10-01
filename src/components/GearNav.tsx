import React, {ChangeEvent, useState, useEffect} from "react";
import {AppBar, Toolbar, Typography, InputBase, Button, Snackbar} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GearRemoveDialog from "./GearRemoveDialog";
import GearAddDialog from "./GearAddDialog";
import GearCheckOutDialog from "./GearCheckOutDialog";
import GearCheckInDialog from "./GearCheckInDialog";
import {useGear} from "src/providers/GearProvider";

type GearNavProps = {
    setSearchParams: React.Dispatch<React.SetStateAction<string>>;
};

export default function GearNav({setSearchParams}: GearNavProps) {
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false);
    const [checkOutDialogOpen, setCheckOutDialogOpen] = useState<boolean>(false);
    const [checkInDialogOpen, setCheckInDialogOpen] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
    }, [screenWidth]);

    const {gearRowSelectionModel} = useGear();

    const updateSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchParams(event.currentTarget.value);
    };

    const handleOpenDeleteDialog = () => {
        if (gearRowSelectionModel.length > 0) {
            setRemoveDialogOpen(true);
        } else {
            // Insert snackbar that says "Please select gear to remove"
            showSnackbar("Please select gear to remove");
        }
    };

    const handleCloseDeleteDialog = () => {
        setRemoveDialogOpen(false);
    };

    const handleOpenCheckOutDialog = () => {
        if (gearRowSelectionModel.length > 0) {
            setCheckOutDialogOpen(true);
        } else {
            // Insert snackbar that says "Please select gear to check out"
            showSnackbar("Please select gear to check out");
        }
    };

    const handleCloseCheckOutDialog = () => {
        setCheckOutDialogOpen(false);
    };

    const handleOpenCheckInDialog = () => {
        if (gearRowSelectionModel.length > 0) {
            setCheckInDialogOpen(true);
        } else {
            // Insert snackbar that says "Please select gear to check in"
            showSnackbar("Please select gear to check in");
        }
    };

    const handleCloseCheckInDialog = () => {
        setCheckInDialogOpen(false);
    };

    const handleOpenAddDialog = () => {
        setAddDialogOpen(true);
    };

    const handleCloseAddDialog = () => {
        setAddDialogOpen(false);
    };

    const handleRemoveClick = () => {
        handleOpenDeleteDialog();
    };

    const showSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const closeSnackbar = () => {
        setSnackbarOpen(false);
    };

    const renderAppBar = () => {
        if (screenWidth < 600) {
            // Render AppBar with buttons below on smaller screens
            return (
                <AppBar position="static" className="rounded-xl mb-4 bg-lime-100">
                    <Toolbar className="flex justify-between items-center py-1">
                        <Typography variant="h4">Gear</Typography>
                        <div className="flex flex-col items-center">
                            <Typography
                                style={{userSelect: "none"}}
                                className="text-xs text-gray-300 text-opacity-0 pointer-events-none"
                            >
                                s
                            </Typography>
                            <div className="relative flex items-center mx-2 bg-peel-100 rounded-lg text-black">
                                <SearchIcon className="absolute left-2" color="inherit" />
                                <InputBase onChange={updateSearch} className="pl-10" />
                            </div>
                            <Typography className="text-xs text-gray-200 italic">
                                Gear Name or RFID
                            </Typography>
                        </div>
                    </Toolbar>
                    <div className="flex justify-between items-center py-1">
                        <Button color="inherit" className="mx-1" onClick={handleOpenCheckInDialog}>
                            Check In
                        </Button>
                        <Button color="inherit" className="mx-1" onClick={handleOpenCheckOutDialog}>
                            Check Out
                        </Button>
                        <Button color="inherit" className="mx-1" onClick={handleOpenAddDialog}>
                            Add Gear
                        </Button>
                        <Button color="inherit" className="" onClick={handleRemoveClick}>
                            Remove Gear
                        </Button>
                    </div>
                </AppBar>
            );
        } else {
            // Render AppBar with buttons in the same row on wider screens
            return (
                <AppBar position="static" className="rounded-xl mb-4 bg-lime-100">
                    <Toolbar className="flex justify-between items-center py-1">
                        <Typography variant="h4">Gear</Typography>
                        <div className="flex flex-col items-center">
                            <Typography
                                style={{userSelect: "none"}}
                                className="text-xs text-gray-300 text-opacity-0 pointer-events-none"
                            >
                                s
                            </Typography>
                            <div className="relative flex items-center mx-2 bg-peel-100 rounded-lg text-black">
                                <SearchIcon className="absolute left-2" color="inherit" />
                                <InputBase onChange={updateSearch} className="pl-10" />
                            </div>
                            <Typography className="text-xs text-gray-200 italic">
                                Gear Name or RFID
                            </Typography>
                        </div>
                        <div className="flex">
                            <Button
                                color="inherit"
                                className="mx-1"
                                onClick={handleOpenCheckInDialog}
                            >
                                Check In
                            </Button>
                            <Button
                                color="inherit"
                                className="mx-1"
                                onClick={handleOpenCheckOutDialog}
                            >
                                Check Out
                            </Button>
                            <Button color="inherit" className="" onClick={handleOpenAddDialog}>
                                Add Gear
                            </Button>
                            <Button color="inherit" className="" onClick={handleRemoveClick}>
                                Remove Gear
                            </Button>
                        </div>
                    </Toolbar>
                </AppBar>
            );
        }
    };

    return (
        <>
            {renderAppBar()}
            <GearRemoveDialog open={removeDialogOpen} onClose={handleCloseDeleteDialog} />
            <GearAddDialog open={addDialogOpen} onClose={handleCloseAddDialog} />
            <GearCheckOutDialog open={checkOutDialogOpen} onClose={handleCloseCheckOutDialog} />
            <GearCheckInDialog open={checkInDialogOpen} onClose={handleCloseCheckInDialog} />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={closeSnackbar}
                message={snackbarMessage}
            />
        </>
    );
}
