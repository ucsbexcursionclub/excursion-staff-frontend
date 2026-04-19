import React, {ChangeEvent, useState, useEffect} from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    InputBase,
    Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import MemberAddDialog from "./MemberAddDialog";
import MemberRemoveDialog from "./MemberRemoveDialog";
import {useMembers} from "../providers/MembersProvider";
import MemberEmailDialog from "./MemberEmailDialog";

type MembersNavProps = {
    setSearchParams: React.Dispatch<React.SetStateAction<string>>;
};

export default function MembersNav({setSearchParams}: MembersNavProps) {
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false);
    const [copyEmailOpen, setCopyEmailOpen] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [copyEmailOption, setCopyEmailOption] = useState("");
    const [searchInput, setSearchInput] = useState("");

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

    const {validateRowSelection} = useMembers();

    const handleOpenAddDialog = () => setAddDialogOpen(true);
    const handleCloseAddDialog = () => setAddDialogOpen(false);

    const handleOpenCopyEmail = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (event.currentTarget.value === "copySelected" && !validateRowSelection()) return;
        setCopyEmailOption(event.currentTarget.value);
        setCopyEmailOpen(true);
    };
    const handleCloseCopyEmail = () => setCopyEmailOpen(false);

    const handleOpenDeleteDialog = () => {
        validateRowSelection() && setRemoveDialogOpen(true);
    };
    const handleCloseDeleteDialog = () => setRemoveDialogOpen(false);

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
                <Toolbar
                    sx={{flexWrap: "wrap", gap: 1, py: 1.5}}
                    className="justify-between"
                >
                    <Typography variant="h5" fontWeight={700} sx={{color: "#1a2e05", letterSpacing: "-0.5px"}}>
                        Members
                    </Typography>

                    {/* Live search */}
                    <div className="flex flex-col items-center flex-1 min-w-[220px] max-w-md mx-2">
                        <div className="relative flex items-center w-full bg-white/70 backdrop-blur-sm rounded-xl border border-lime-300 shadow-sm focus-within:border-lime-500 focus-within:ring-2 focus-within:ring-lime-200 transition-all">
                            <SearchIcon className="absolute left-3 text-lime-600" fontSize="small" />
                            <InputBase
                                value={searchInput}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setSearchInput(e.currentTarget.value)
                                }
                                placeholder="Search by name, email, or phone…"
                                className="pl-10 pr-8 py-1 w-full text-sm"
                                inputProps={{"aria-label": "search members"}}
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
                        <Button
                            size="small"
                            variant="contained"
                            onClick={handleOpenAddDialog}
                            sx={{
                                backgroundColor: "#4ade80",
                                color: "#14532d",
                                "&:hover": {backgroundColor: "#22c55e"},
                                borderRadius: "8px",
                                textTransform: "none",
                                fontWeight: 600,
                                boxShadow: "none"
                            }}
                        >
                            Add / Renew Member
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={handleOpenDeleteDialog}
                            sx={{
                                borderColor: "#86efac",
                                color: "#166534",
                                "&:hover": {borderColor: "#22c55e", backgroundColor: "#f0fdf4"},
                                borderRadius: "8px",
                                textTransform: "none",
                                fontWeight: 600
                            }}
                        >
                            Remove Member(s)
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            value="copySelected"
                            onClick={handleOpenCopyEmail}
                            sx={{
                                borderColor: "#86efac",
                                color: "#166534",
                                "&:hover": {borderColor: "#22c55e", backgroundColor: "#f0fdf4"},
                                borderRadius: "8px",
                                textTransform: "none",
                                fontWeight: 600
                            }}
                        >
                            Copy Emails
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>

            <MemberAddDialog open={addDialogOpen} onClose={handleCloseAddDialog} />
            <MemberRemoveDialog open={removeDialogOpen} onClose={handleCloseDeleteDialog} />
            <MemberEmailDialog
                open={copyEmailOpen}
                onClose={handleCloseCopyEmail}
                screenwidth={screenWidth}
                copyEmailOption={copyEmailOption}
            />
        </>
    );
}
