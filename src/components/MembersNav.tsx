import React, {ChangeEvent, FormEvent, KeyboardEvent, useState, useEffect} from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    InputBase,
    Button,
    ButtonGroup,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const {validateRowSelection} = useMembers();

    const handleOpenAddDialog = () => {
        setAddDialogOpen(true);
    };

    const handleOpenCopyEmail = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (event.currentTarget.value === null) return;
        if (event.currentTarget.value === "copySelected" && !validateRowSelection()) return;

        setCopyEmailOption(event.currentTarget.value);
        setCopyEmailOpen(true);
    };

    const handleCloseCopyEmail = () => {
        // Display the Snackbar when the "Copy Email(s)" button is clicked
        setCopyEmailOpen(false);
    };

    const handleCloseAddDialog = () => {
        setAddDialogOpen(false);
    };

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

    const handleRemoveClick = () => {
        handleOpenDeleteDialog();
    };

    const renderAppBar = () => {
        return (
            <AppBar position="static" className="rounded-xl mb-4 bg-lime-100">
                <Toolbar className="flex justify-between items-center py-1 flex-row max-[800px]:flex-col">
                    <Typography variant="h4" className="pr-3">
                        Members
                    </Typography>
                    <div className="flex flex-col items-center w-full max-[800px]:my-4">
                        {/* Placeholder Typography for spacing (remove if not needed) */}
                        <Typography
                            style={{ userSelect: "none" }}
                            className="text-xs text-gray-300 text-opacity-0 pointer-events-none"
                        >
                            s
                        </Typography>
                        <form
                            className="relative flex items-center mx-2 bg-peel-100 rounded-lg w-full "
                            onSubmit={handleSearchSubmit}
                        >
                            <SearchIcon className="absolute left-2" color="inherit" />
                            <InputBase
                                value={searchInput}
                                onChange={updateSearch}
                                onKeyDown={handleSearchKeyDown}
                                className="pl-10 w-full"
                            />
                            <Button
                                type="submit"
                                color="inherit"
                                className="rounded-lg text-sm bg-lime-200"
                            >
                                Search
                            </Button>
                        </form>
                        <Typography className="text-xs text-gray-200 italic">
                            Name, Email, or Phone Number
                        </Typography>
                    </div>
                    <div className="flex flex-col mx-4 md:flex-row items-center w-full md:w-auto">
                        <Button color="inherit" className="mx-1" onClick={handleOpenAddDialog}>
                            Add/Renew Member
                        </Button>
                        <Button color="inherit" className="mx-1" onClick={handleRemoveClick}>
                            Remove Member(s)
                        </Button>
                        <div className="hidden md:block"> {/* Show on medium screens and above */}
                            <ButtonGroup
                                className="text-white"
                                style={{ boxShadow: "none" }}
                            >
                                <Button
                                    onClick={handleOpenCopyEmail}
                                    value="copySelected"
                                    className="text-white border-transparent"
                                >
                                    Copy Selected Members Emails
                                </Button>
                            </ButtonGroup>
                        </div>
                        <div className="md:hidden"> {/* Show only on smaller screens */}
                            <ToggleButtonGroup
                                exclusive
                                value={copyEmailOption}
                                className="text-white"
                                style={{ boxShadow: "none" }}
                            >
                                <ToggleButton
                                    value="copySelected"
                                    className="text-white border-transparent"
                                >
                                    Copy Selected Members Emails
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        );
    };

    return (
        <>
            {renderAppBar()}
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
