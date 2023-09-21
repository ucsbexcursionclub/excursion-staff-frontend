import React, {ChangeEvent, useState} from "react";
import {AppBar, Toolbar, Typography, InputBase, Button} from "@mui/material";
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

    const {gearRowSelectionModel} = useGear();

    const updateSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchParams(event.currentTarget.value);
    };

    const handleOpenDeleteDialog = () => {
        gearRowSelectionModel.length > 0 && setRemoveDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setRemoveDialogOpen(false);
    };

    const handleOpenCheckOutDialog = () => {
        gearRowSelectionModel.length > 0 && setCheckOutDialogOpen(true);
    };

    const handleCloseCheckOutDialog = () => {
        setCheckOutDialogOpen(false);
    };

    const handleOpenCheckInDialog = () => {
        gearRowSelectionModel.length > 0 && setCheckInDialogOpen(true);
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

    return (
        <>
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
                        <Button color="inherit" className="mx-1" onClick={handleOpenCheckInDialog}>
                            Check In
                        </Button>
                        <Button color="inherit" className="mx-1" onClick={handleOpenCheckOutDialog}>
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
            <GearRemoveDialog open={removeDialogOpen} onClose={handleCloseDeleteDialog} />
            <GearAddDialog open={addDialogOpen} onClose={handleCloseAddDialog} />
            <GearCheckOutDialog open={checkOutDialogOpen} onClose={handleCloseCheckOutDialog} />
            <GearCheckInDialog open={checkInDialogOpen} onClose={handleCloseCheckInDialog} />
        </>
    );
}
