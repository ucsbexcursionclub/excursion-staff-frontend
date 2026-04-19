import React, {ChangeEvent, useState, useEffect} from "react";
import {AppBar, Toolbar, Typography, InputBase, Button} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import StaffAddDialog from "./StaffAddDialog";
import StaffRemoveDialog from "./StaffRemoveDialog";
import StaffEmailDialog from "./StaffEmailDialog";
import {useStaff} from "../providers/StaffProvider";

type StaffNavProps = {
    setSearchParams: React.Dispatch<React.SetStateAction<string>>;
};

export default function StaffNav({setSearchParams}: StaffNavProps) {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const [copyEmailOpen, setCopyEmailOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const {validateRowSelection} = useStaff();

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Debounced real-time search — fires 300 ms after the user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchParams(searchInput.trim());
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput, setSearchParams]);

    const handleAddDialogOpen = () => setAddDialogOpen(true);
    const handleAddDialogClose = () => setAddDialogOpen(false);
    const handleRemoveDialogOpen = () => { validateRowSelection() && setRemoveDialogOpen(true); };
    const handleRemoveDialogClose = () => setRemoveDialogOpen(false);
    const handleOpenCopyEmail = () => { validateRowSelection() && setCopyEmailOpen(true); };
    const handleCloseCopyEmail = () => setCopyEmailOpen(false);

    const actionBtn = (
        label: string,
        onClick: () => void,
        variant: "contained" | "outlined" = "outlined"
    ) => (
        <Button
            key={label}
            size="small"
            variant={variant}
            onClick={onClick}
            sx={{
                ...(variant === "contained"
                    ? {
                          backgroundColor: "#818cf8",
                          color: "white",
                          "&:hover": {backgroundColor: "#6366f1"}
                      }
                    : {
                          borderColor: "#c7d2fe",
                          color: "#3730a3",
                          "&:hover": {borderColor: "#6366f1", backgroundColor: "#eef2ff"}
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
                    background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
                    color: "inherit"
                }}
            >
                <Toolbar sx={{flexWrap: "wrap", gap: 1, py: 1.5}} className="justify-between">
                    <Typography variant="h5" fontWeight={700} sx={{color: "#1e1b4b", letterSpacing: "-0.5px"}}>
                        Edit Staff
                    </Typography>

                    {/* Live search */}
                    <div className="flex flex-col items-center flex-1 min-w-[200px] max-w-sm mx-2">
                        <div className="relative flex items-center w-full bg-white/70 backdrop-blur-sm rounded-xl border border-indigo-200 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                            <SearchIcon className="absolute left-3" sx={{color: "#6366f1"}} fontSize="small" />
                            <InputBase
                                value={searchInput}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setSearchInput(e.currentTarget.value)
                                }
                                placeholder="Search staff…"
                                className="pl-10 pr-8 py-1 w-full text-sm"
                                inputProps={{"aria-label": "search staff"}}
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
                        <Typography className="text-xs mt-0.5" sx={{color: "#4338ca", opacity: 0.8}}>
                            Results update as you type
                        </Typography>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-1 items-center">
                        {actionBtn("Add / Update", handleAddDialogOpen, "contained")}
                        {actionBtn("Remove", handleRemoveDialogOpen)}
                        {actionBtn("Copy Emails", handleOpenCopyEmail)}
                    </div>
                </Toolbar>
            </AppBar>

            <StaffAddDialog open={addDialogOpen} onClose={handleAddDialogClose} />
            <StaffRemoveDialog open={removeDialogOpen} onClose={handleRemoveDialogClose} />
            <StaffEmailDialog
                open={copyEmailOpen}
                onClose={handleCloseCopyEmail}
                screenwidth={screenWidth}
            />
        </>
    );
}
