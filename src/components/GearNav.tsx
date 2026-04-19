import React, {ChangeEvent, useState, useEffect} from "react";
import {AppBar, Toolbar, Typography, InputBase, Button} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
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

    // Debounced real-time search — fires 300 ms after the user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchParams(searchInput.trim());
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput, setSearchParams]);

    const handleOpenDeleteDialog = () => {
        validateRowSelection() && setRemoveDialogOpen(true);
    };
    const handleCloseDeleteDialog = () => setRemoveDialogOpen(false);

    const handleOpenCheckOutDialog = () => {
        validateRowSelection() && setCheckOutDialogOpen(true);
    };
    const handleCloseCheckOutDialog = () => setCheckOutDialogOpen(false);

    const handleOpenCheckInDialog = () => {
        validateRowSelection() && setCheckInDialogOpen(true);
    };
    const handleCloseCheckInDialog = () => setCheckInDialogOpen(false);

    const handleOpenAddDialog = () => setAddDialogOpen(true);
    const handleCloseAddDialog = () => setAddDialogOpen(false);

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

    const actionBtn = (label: string, onClick: () => void, variant: "contained" | "outlined" = "outlined") => (
        <Button
            key={label}
            size="small"
            variant={variant}
            onClick={onClick}
            sx={{
                ...(variant === "contained"
                    ? {
                          backgroundColor: "#4ade80",
                          color: "#14532d",
                          "&:hover": {backgroundColor: "#22c55e"}
                      }
                    : {
                          borderColor: "#86efac",
                          color: "#166534",
                          "&:hover": {borderColor: "#22c55e", backgroundColor: "#f0fdf4"}
                      }),
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none"
            }}
        >
            {label}
        </Button>
    );

    return (
        <>
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    borderRadius: "12px",
                    mb: 2,
                    background: "linear-gradient(135deg, #d9f99d 0%, #bbf7d0 100%)",
                    color: "inherit"
                }}
            >
                <Toolbar sx={{flexWrap: "wrap", gap: 1, py: 1.5}} className="justify-between">
                    <Typography variant="h5" fontWeight={700} sx={{color: "#1a2e05", letterSpacing: "-0.5px"}}>
                        Gear
                    </Typography>

                    {/* Live search */}
                    <div className="flex flex-col items-center flex-1 min-w-[200px] max-w-sm mx-2">
                        <div className="relative flex items-center w-full bg-white/70 backdrop-blur-sm rounded-xl border border-lime-300 shadow-sm focus-within:border-lime-500 focus-within:ring-2 focus-within:ring-lime-200 transition-all">
                            <SearchIcon className="absolute left-3 text-lime-600" fontSize="small" />
                            <InputBase
                                value={searchInput}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setSearchInput(e.currentTarget.value)
                                }
                                placeholder="Search gear by name…"
                                className="pl-10 pr-8 py-1 w-full text-sm"
                                inputProps={{"aria-label": "search gear"}}
                            />
                            {searchInput && (
                                <IconButton
                                    size="small"
                                    className="absolute right-1"
                                    onClick={() => setSearchInput("")}
                                    aria-label="clear search"
                                >
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            )}
                        </div>
                        <Typography className="text-xs mt-0.5" sx={{color: "#4d7c0f", opacity: 0.8}}>
                            Results update as you type
                        </Typography>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-1 items-center">
                        {actionBtn("Check In", handleOpenCheckInDialog, "contained")}
                        {actionBtn("Check Out", handleOpenCheckOutDialog, "contained")}
                        {actionBtn("Add Gear", handleOpenAddDialog)}
                        {actionBtn("Remove Gear", handleOpenDeleteDialog)}
                        {actionBtn("Copy Emails", () => void handleCopyContacts("email"))}
                        {actionBtn("Copy Phones", () => void handleCopyContacts("phone_number"))}
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
