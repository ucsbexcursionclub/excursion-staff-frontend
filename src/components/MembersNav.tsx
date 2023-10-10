import React, {ChangeEvent, useState, useEffect} from "react";
import {AppBar, Toolbar, Typography, InputBase, Button} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MemberAddDialog from "./MemberAddDialog";
import MemberRemoveDialog from "./MemberRemoveDialog";
import FailMemberRemoveDialog from "./FailMemberRemoveDialog";
import {useMembers} from "../providers/MembersProvider";
import MemberEmailDialog from "./MemberEmailDialog";
import {ToggleButtonGroup, ToggleButton} from "@mui/material";
type MembersNavProps = {
    setSearchParams: React.Dispatch<React.SetStateAction<string>>;
};

export default function MembersNav({setSearchParams}: MembersNavProps) {
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false);
    const [failRemoveDialogOpen, setFailRemoveDialogOpen] = useState<boolean>(false);
    const [copyEmailOpen, setCopyEmailOpen] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [copyEmailOption, setCopyEmailOption] = useState("");

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
    }, [screenWidth]);

    const {memberRowSelectionModel} = useMembers();

    const handleOpenAddDialog = () => {
        setAddDialogOpen(true);
    };

    const handleOpenCopyEmail = () => {
        // Display the Snackbar when the "Copy Email(s)" button is clicked
        setCopyEmailOpen(true);
    };

    const handleCloseCopyEmail = () => {
        // Display the Snackbar when the "Copy Email(s)" button is clicked
        setCopyEmailOption("");
        setCopyEmailOpen(false);
    };

    const handleCloseAddDialog = () => {
        setAddDialogOpen(false);
    };

    const updateSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchParams(event.currentTarget.value);
    };

    const handleOpenDeleteDialog = () => {
        if (memberRowSelectionModel.length > 0) {
            setRemoveDialogOpen(true);
        } else {
            setFailRemoveDialogOpen(true);
        }
    };

    const handleCloseDeleteDialog = () => {
        setRemoveDialogOpen(false);
    };

    const handleCloseFailDeleteDialog = () => {
        setFailRemoveDialogOpen(false);
    };

    const handleRemoveClick = () => {
        handleOpenDeleteDialog();
    };

    const handleCopyEmailOptionChange = (
        event: React.MouseEvent<HTMLElement>,
        newValue: string | null
    ) => {
        if (newValue !== null) {
            setCopyEmailOption(newValue);
            handleOpenCopyEmail();
        }
    };

    const renderAppBar = () => {
        if (screenWidth < 1000) {
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
                        <ToggleButtonGroup
                            exclusive
                            value={copyEmailOption}
                            onChange={handleCopyEmailOptionChange}
                            className="text-white" // Add text-white class to make text white
                            style={{boxShadow: "none"}} // Remove the box-shadow to remove the outline
                        >
                            <ToggleButton
                                value="copySelected"
                                className="text-white border-transparent"
                            >
                                Copy Selected Members
                            </ToggleButton>
                            <ToggleButton
                                value="copyActive"
                                className="text-white border-transparent"
                            >
                                Copy Active Members
                            </ToggleButton>
                            <ToggleButton
                                value="copyExpired"
                                className="text-white border-transparent"
                            >
                                Copy Expired Members
                            </ToggleButton>
                        </ToggleButtonGroup>
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
                            <ToggleButtonGroup
                                exclusive
                                value={copyEmailOption}
                                onChange={handleCopyEmailOptionChange}
                                className="text-white" // Add text-white class to make text white
                                style={{boxShadow: "none"}} // Remove the box-shadow to remove the outline
                            >
                                <ToggleButton
                                    value="copySelected"
                                    className="text-white border-transparent"
                                >
                                    Copy Selected Members
                                </ToggleButton>
                                <ToggleButton
                                    value="copyActive"
                                    className="text-white border-transparent"
                                >
                                    Copy Active Members
                                </ToggleButton>
                                <ToggleButton
                                    value="copyExpired"
                                    className="text-white border-transparent"
                                >
                                    Copy Expired Members
                                </ToggleButton>
                            </ToggleButtonGroup>
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
            <FailMemberRemoveDialog
                open={failRemoveDialogOpen}
                onClose={handleCloseFailDeleteDialog}
            />
            <MemberEmailDialog
                open={copyEmailOpen}
                onClose={handleCloseCopyEmail}
                screenwidth={screenWidth}
                copyEmailOption={copyEmailOption}
            />
        </>
    );
}
