import React, {ChangeEvent, FormEvent, KeyboardEvent, useState} from "react";
import {AppBar, Toolbar, Typography, InputBase, Button} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GearRemoveDialog from "./GearRemoveDialog";
import GearAddDialog from "./GearAddDialog";
import GearCheckOutDialog from "./GearCheckOutDialog";
import GearCheckInDialog from "./GearCheckInDialog";
import {useGear} from "../providers/GearProvider";
import {useSnackbar} from "../providers/SnackBarProvider";

type GearNavProps = {
    setSearchParams: React.Dispatch<React.SetStateAction<string>>;
};

export default function GearNav({setSearchParams}: GearNavProps) {
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false);
    const [checkOutDialogOpen, setCheckOutDialogOpen] = useState<boolean>(false);
    const [checkInDialogOpen, setCheckInDialogOpen] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState("");

    const {validateRowSelection, gearRowSelectionModel, retrieveGearItem} = useGear();
    const {addNotification} = useSnackbar();

    const updateSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchInput(event.currentTarget.value);
    };

    const submitSearch = () => {
        setSearchParams(searchInput.trim());
    };

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submitSearch();
    };

    const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            submitSearch();
        }
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

    const handleCopyContacts = async (field: "email" | "phone_number") => {
        if (!validateRowSelection()) return;

        const values = Array.from(
            new Set(
                gearRowSelectionModel
                    .map((id) => retrieveGearItem(id.toString())?.memberDetails?.[field])
                    .filter(Boolean) as string[]
            )
        );

        if (values.length === 0) {
            addNotification({
                message:
                    field === "email"
                        ? "No checked out member emails found in the selected gear."
                        : "No checked out member phone numbers found in the selected gear.",
                type: "error"
            });
            return;
        }

        try {
            await navigator.clipboard.writeText(values.join("\n"));
            addNotification({
                message:
                    field === "email"
                        ? "Copied selected member emails."
                        : "Copied selected member phone numbers.",
                type: "success"
            });
        } catch (_error) {
            addNotification({
                message: "Copy failed. Please check browser clipboard permissions.",
                type: "error"
            });
        }
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
                        <form
                            className="relative flex items-center mx-2 bg-peel-100 rounded-lg text-black"
                            onSubmit={handleSearchSubmit}
                        >
                            <SearchIcon className="absolute left-2" color="inherit" />
                            <InputBase
                                value={searchInput}
                                onChange={updateSearch}
                                onKeyDown={handleSearchKeyDown}
                                className="pl-10"
                            />
                            <Button type="submit" color="inherit">
                                Search
                            </Button>
                        </form>
                        <Typography className="text-xs text-gray-200 italic">
                            Gear Name
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
                        <Button color="inherit" onClick={() => void handleCopyContacts("email")}>
                            Copy Emails
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => void handleCopyContacts("phone_number")}
                        >
                            Copy Phones
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
