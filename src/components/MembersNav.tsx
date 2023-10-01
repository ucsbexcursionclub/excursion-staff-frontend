import React, {ChangeEvent, useState, useEffect} from "react";
import {AppBar, Toolbar, Typography, InputBase, Button} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MemberAddDialog from "src/components/MemberAddDialog";
import MemberRemoveDialog from "src/components/MemberRemoveDialog";
import FailMemberRemoveDialog from "src/components/FailMemberRemoveDialog";
import {useMembers} from "src/providers/MembersProvider";
import MemberEmailDialog from "./MemberEmailDialog";
import {Select, MenuItem} from "@mui/material";

type MembersNavProps = {
    setSearchParams: React.Dispatch<React.SetStateAction<string>>;
    setFilter: (filter: string) => void;
};

export default function MembersNav({setSearchParams, setFilter}: MembersNavProps) {
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false);
    const [failRemoveDialogOpen, setFailRemoveDialogOpen] = useState<boolean>(false);
    const [copyEmailOpen, setCopyEmailOpen] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Initialize with the current window width
    const [filterVal, setFilterVal] = useState("all"); // 'all', 'active', or 'expired'

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

    const handleFilterChange = (event) => {
        setFilterVal(event.target.value);
        setFilter(event.target.value);
    };

    const renderAppBar = () => {
        if (screenWidth < 600) {
            // Render AppBar with buttons below on smaller screens
            return (
                <AppBar position="static" className="rounded-xl mb-4 bg-lime-100">
                    <Toolbar className="flex justify-between items-center py-1">
                        <Typography variant="h4">Members</Typography>
                        <div style={{color: "white"}}>
                            <Select
                                inputProps={{
                                    className:
                                        "appearance-none bg-transparent border-none w-full text-white placeholder-white focus:outline-none"
                                }}
                                value={filterVal}
                                onChange={handleFilterChange}
                            >
                                <MenuItem value="all">All Members</MenuItem>
                                <MenuItem value="active">Active Members</MenuItem>
                                <MenuItem value="expired">Expired Members</MenuItem>
                            </Select>
                        </div>
                    </Toolbar>
                    <Toolbar className="flex justify-between items-center py-1 w-full">
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

                    <div className="flex flex justify-center">
                        <Button color="inherit" className="mx-1" onClick={handleOpenAddDialog}>
                            Add/Renew Member
                        </Button>
                        <Button color="inherit" className="mx-1" onClick={handleRemoveClick}>
                            Remove Member(s)
                        </Button>
                        <Button color="inherit" className="mx-1" onClick={handleOpenCopyEmail}>
                            Copy Email(s)
                        </Button>
                    </div>
                </AppBar>
            );
        } else if (screenWidth < 800) {
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
                        <Button color="inherit" className="mx-1" onClick={handleOpenCopyEmail}>
                            Copy Email(s)
                        </Button>
                        <div style={{color: "white"}}>
                            <Select
                                inputProps={{
                                    className:
                                        "appearance-none bg-transparent border-none w-full text-white placeholder-white focus:outline-none"
                                }}
                                value={filterVal}
                                onChange={handleFilterChange}
                            >
                                <MenuItem value="all">All Members</MenuItem>
                                <MenuItem value="active">Active Members</MenuItem>
                                <MenuItem value="expired">Expired Members</MenuItem>
                            </Select>
                        </div>
                    </div>
                </AppBar>
            );
        } else if (screenWidth < 950) {
            // Render AppBar with buttons in the same row on wider screens
            return (
                <AppBar position="static" className="rounded-xl mb-4 bg-lime-100">
                    <Toolbar className="flex justify-between items-center py-1 mb-[-20px]">
                        <Typography variant="h4" className="pr-3">
                            Members
                        </Typography>
                        <div className="flex justify-end pr-3">
                            <Button color="inherit" className="mx-1" onClick={handleOpenAddDialog}>
                                Add/Renew Member
                            </Button>
                            <Button color="inherit" className="mx-1" onClick={handleRemoveClick}>
                                Remove Member(s)
                            </Button>
                            <Button color="inherit" className="mx-1" onClick={handleOpenCopyEmail}>
                                Copy Email(s)
                            </Button>
                            <div style={{color: "white"}}>
                                <Select
                                    inputProps={{
                                        className:
                                            "appearance-none bg-transparent border-none w-full text-white placeholder-white focus:outline-none"
                                    }}
                                    value={filterVal}
                                    onChange={handleFilterChange}
                                >
                                    <MenuItem value="all">All Members</MenuItem>
                                    <MenuItem value="active">Active Members</MenuItem>
                                    <MenuItem value="expired">Expired Members</MenuItem>
                                </Select>
                            </div>
                        </div>
                    </Toolbar>
                    <div className="flex flex-col items-center w-full p-4">
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
                            <Button color="inherit" className="mx-1" onClick={handleOpenCopyEmail}>
                                Copy Email(s)
                            </Button>
                            <div style={{color: "white"}}>
                                <Select
                                    inputProps={{
                                        className:
                                            "appearance-none bg-transparent border-none w-full text-white placeholder-white focus:outline-none"
                                    }}
                                    value={filterVal}
                                    onChange={handleFilterChange}
                                >
                                    <MenuItem value="all">All Members</MenuItem>
                                    <MenuItem value="active">Active Members</MenuItem>
                                    <MenuItem value="expired">Expired Members</MenuItem>
                                </Select>
                            </div>
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
            />
        </>
    );
}
