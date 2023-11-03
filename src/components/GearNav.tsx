import React, {ChangeEvent, useState, useEffect} from "react";
import {AppBar, Toolbar, Typography, InputBase, Button} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GearRemoveDialog from "./GearRemoveDialog";
import GearAddDialog from "./GearAddDialog";
import GearCheckOutDialog from "./GearCheckOutDialog";
import GearCheckInDialog from "./GearCheckInDialog";
import {useGear} from "../providers/GearProvider";

type GearNavProps = {
    setSearchParams: React.Dispatch<React.SetStateAction<string>>;
};

export default function GearNav({setSearchParams}: GearNavProps) {
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false);
    const [checkOutDialogOpen, setCheckOutDialogOpen] = useState<boolean>(false);
    const [checkInDialogOpen, setCheckInDialogOpen] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
    }, [screenWidth]);

    const {validateRowSelection} = useGear();

    const updateSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchParams(event.currentTarget.value);
    };

    const handleOpenDeleteDialog = () => {
        validateRowSelection() && setRemoveDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setRemoveDialogOpen(false);
    };

    const handleOpenCheckOutDialog = () => {
        validateRowSelection() && setCheckOutDialogOpen(true);
    };

    const handleCloseCheckOutDialog = () => {
        setCheckOutDialogOpen(false);
    };

    const handleOpenCheckInDialog = () => {
        validateRowSelection() && setCheckInDialogOpen(true);
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
            <AppBar position="static" className="rounded-xl mb-4 bg-lime-100 px-4">
                <Toolbar className="flex items-center flex-wrap py-1 px-0 justify-between max-[800px]:justify-center">
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
                    <div className="flex justify-between items-center py-1">
                        <Button color="inherit" onClick={handleOpenCheckInDialog}>
                            Check In
                        </Button>
                        <Button color="inherit" onClick={handleOpenCheckOutDialog}>
                            Check Out
                        </Button>
                        <Button color="inherit" onClick={handleOpenAddDialog}>
                            Add Gear
                        </Button>
                        <Button color="inherit" onClick={handleRemoveClick}>
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
