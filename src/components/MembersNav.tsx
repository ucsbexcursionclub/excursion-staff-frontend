import React, {ChangeEvent, useState, useEffect} from "react";
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

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
    }, [screenWidth]);

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
        setSearchParams(event.currentTarget.value);
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
        if (screenWidth < 530) {
            // Render AppBar with buttons in the same row on wider screens
            return (
                <AppBar position="static" className="rounded-xl mb-4 bg-lime-100">
                    <Toolbar className="flex justify-between items-center py-1">
                        <Typography variant="h4" className="pr-3">
                            Members
                        </Typography>
                        <div className="flex flex-col items-center w-full">
                            <Typography
                                style={{userSelect: "none"}}
                                className="text-xs text-gray-300 text-opacity-0 pointer-events-none"
                            >
                                s
                            </Typography>
                            <div className="relative flex items-center mx-2 bg-peel-100 rounded-lg w-full">
                                <SearchIcon className="absolute left-2" color="inherit" />
                                <InputBase onChange={updateSearch} className="pl-10 w-full" />
                                <Button color="inherit" className="rounded-lg text-sm bg-lime-200">
                                    Search
                                </Button>
                            </div>
                            <Typography className="text-xs text-gray-200 italic">
                                Name, Email, or Phone Number
                            </Typography>
                        </div>
                    </Toolbar>
                    <div className="flex justify-end pr-3">
                        <Button color="inherit" className="mx-1" onClick={handleOpenAddDialog}>
                            Add/Renew Member
                        </Button>
                        <Button color="inherit" className="mx-1" onClick={handleRemoveClick}>
                            Remove Member(s)
                        </Button>
                    </div>
                    <div className="flex justify-end pr-3">
                        <ToggleButtonGroup
                            exclusive
                            value={copyEmailOption}
                            className="text-white" // Add text-white class to make text white
                            style={{boxShadow: "none"}} // Remove the box-shadow to remove the outline
                        >
                            <ToggleButton
                                value="copySelected"
                                className="text-white border-transparent"
                            >
                                Copy Selected Members Emails
                            </ToggleButton>

                        </ToggleButtonGroup>
                    </div>
                </AppBar>
            );
        } else if (screenWidth < 1000) {
            // Render AppBar with buttons in the same row on wider screens
            return (
                <AppBar position="static" className="rounded-xl mb-4 bg-lime-100">
                    <Toolbar className="flex justify-between items-center py-1">
                        <Typography variant="h4" className="pr-3">
                            Members
                        </Typography>
                        <div className="flex flex-col items-center w-full">
                            <Typography
                                style={{userSelect: "none"}}
                                className="text-xs text-gray-300 text-opacity-0 pointer-events-none"
                            >
                                s
                            </Typography>
                            <div className="relative flex items-center mx-2 bg-peel-100 rounded-lg w-full">
                                <SearchIcon className="absolute left-2" color="inherit" />
                                <InputBase onChange={updateSearch} className="pl-10 w-full" />
                                <Button color="inherit" className="rounded-lg text-sm bg-lime-200">
                                    Search
                                </Button>
                            </div>
                            <Typography className="text-xs text-gray-200 italic">
                                Name, Email, or Phone Number
                            </Typography>
                        </div>
                    </Toolbar>
                    <div className="flex justify-end pr-3">
                        <Button color="inherit" className="mx-1" onClick={handleOpenAddDialog}>
                            Add/Renew Member
                        </Button>
                        <Button color="inherit" className="mx-1" onClick={handleRemoveClick}>
                            Remove Member(s)
                        </Button>
                        <ButtonGroup
                            className="text-white" // Add text-white class to make text white
                            style={{boxShadow: "none"}} // Remove the box-shadow to remove the outline
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
                </AppBar>
            );
        } else {
            // Render AppBar with buttons in the same row on wider screens
            return (
                <AppBar position="static" className="rounded-xl mb-4 bg-lime-100">
                    <Toolbar className="flex justify-between items-center py-1">
                        <Typography variant="h4" className="pr-3">
                            Members
                        </Typography>
                        <div className="flex flex-col items-center w-full">
                            <Typography
                                style={{userSelect: "none"}}
                                className="text-xs text-gray-300 text-opacity-0 pointer-events-none"
                            >
                                s
                            </Typography>
                            <div className="relative flex items-center mx-2 bg-peel-100 rounded-lg w-full">
                                <SearchIcon className="absolute left-2" color="inherit" />
                                <InputBase onChange={updateSearch} className="pl-10 w-full" />
                                <Button color="inherit" className="rounded-lg text-sm bg-lime-200">
                                    Search
                                </Button>
                            </div>
                            <Typography className="text-xs text-gray-200 italic">
                                Name, Email, or Phone Number
                            </Typography>
                        </div>
                        <div className="flex justify-end pr-3">
                            <Button color="inherit" className="mx-1" onClick={handleOpenAddDialog}>
                                Add/Renew Member
                            </Button>
                            <Button color="inherit" className="mx-1" onClick={handleRemoveClick}>
                                Remove Member(s)
                            </Button>
                            <ButtonGroup
                                className="text-white" // Add text-white class to make text white
                                style={{boxShadow: "none"}} // Remove the box-shadow to remove the outline
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
                    </Toolbar>
                </AppBar>
            );
        }
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
