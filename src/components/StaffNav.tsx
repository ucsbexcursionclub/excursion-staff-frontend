import React, {ChangeEvent, useState, useEffect} from "react";
import {AppBar, Toolbar, Typography, InputBase, Button} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StaffAddDialog from "./StaffAddDialog";
import StaffRemoveDialog from "./StaffRemoveDialog";
import StaffEmailDialog from "./StaffEmailDialog";

type StaffNavProps = {
    setSearchParams: React.Dispatch<React.SetStateAction<string>>;
};

export default function StaffNav({setSearchParams}: StaffNavProps) {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const [copyEmailOpen, setCopyEmailOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const updateSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchParams(event.currentTarget.value);
    };

    const handleAddDialogOpen = () => {
        setAddDialogOpen(true);
    };

    const handleRemoveDialogOpen = () => {
        setRemoveDialogOpen(true);
    };

    const handleRemoveDialogClose = () => {
        setRemoveDialogOpen(false);
    };

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
    };

    const handleOpenCopyEmail = () => {
        setCopyEmailOpen(true);
    };

    const handleCloseCopyEmail = () => {
        setCopyEmailOpen(false);
    };

    const renderAppBar = () => {
        if (screenWidth > 700) {
            return (
                <AppBar position="static" className="rounded-xl mb-4 bg-lime-100">
                    <Toolbar className="flex justify-between items-center py-1">
                        <Typography variant="h4">Edit Staff</Typography>
                        <div className="flex items-center">
                            <div className="relative flex items-center mx-2 bg-peel-100 rounded-lg">
                                <SearchIcon className="absolute left-2" color="inherit" />
                                <InputBase onChange={updateSearch} className="pl-10" />
                                <Button color="inherit" className="rounded-lg text-sm bg-lime-200">
                                    Search
                                </Button>
                            </div>
                        </div>
                        <div className="flex">
                            <Button color="inherit" className="mx-1" onClick={handleAddDialogOpen}>
                                Add/Update
                            </Button>
                            <Button
                                color="inherit"
                                className="mx-1"
                                onClick={handleRemoveDialogOpen}
                            >
                                Remove
                            </Button>

                            <Button color="inherit" className="mx-1" onClick={handleOpenCopyEmail}>
                                Copy Email(s)
                            </Button>
                        </div>
                    </Toolbar>
                </AppBar>
            );
        } else {
            return (
                <AppBar position="static" className="rounded-xl mb-4 bg-lime-100">
                    <Toolbar className="flex justify-between items-center py-1">
                        <Typography variant="h4">Edit Staff</Typography>
                        <div className="flex items-center">
                            <div className="relative flex items-center mx-2 bg-peel-100 rounded-lg">
                                <SearchIcon className="absolute left-2" color="inherit" />
                                <InputBase onChange={updateSearch} className="pl-10" />
                                <Button color="inherit" className="rounded-lg text-sm bg-lime-200">
                                    Search
                                </Button>
                            </div>
                        </div>
                    </Toolbar>
                    <div className="flex">
                        <Button color="inherit" className="mx-1" onClick={handleAddDialogOpen}>
                            Add/Update
                        </Button>
                        <Button color="inherit" className="mx-1" onClick={handleRemoveDialogOpen}>
                            Remove
                        </Button>

                        <Button color="inherit" className="mx-1" onClick={handleOpenCopyEmail}>
                            Copy Email(s)
                        </Button>
                    </div>
                </AppBar>
            );
        }
    };

    return (
        <>
            {renderAppBar()}
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
