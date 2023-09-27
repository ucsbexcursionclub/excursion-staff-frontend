import React, {ChangeEvent, useState, useEffect} from "react";
import {AppBar, Toolbar, Typography, InputBase, Button} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StaffAddDialog from "src/components/StaffAddDialog";
import StaffUpdateDialog from "src/components/StaffUpdateDialog"; // Step 1

type StaffNavProps = {
    setSearchParams: React.Dispatch<React.SetStateAction<string>>;
};

export default function StaffNav({setSearchParams}: StaffNavProps) {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false); // Step 2

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

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
    };

    const handleUpdateDialogOpen = () => {
        setUpdateDialogOpen(true); // Step 3
    };

    const handleUpdateDialogClose = () => {
        setUpdateDialogOpen(false); // Step 3
    };

    const renderAppBar = () => {
        if (screenWidth > 700) {
            return (
                <AppBar position="static" className="rounded-xl mb-4 bg-lime-100">
                    <Toolbar>
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
                                Add Staff
                            </Button>
                            <Button
                                color="inherit"
                                className="mx-1"
                                onClick={handleUpdateDialogOpen}
                            >
                                Update
                            </Button>{" "}
                            {/* Step 3: Button to open the dialog */}
                            <Button color="inherit" className="mx-1">
                                Remove Staff
                            </Button>
                            <Button color="inherit" className="mx-1">
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
                            Add
                        </Button>
                        <Button color="inherit" className="mx-1" onClick={handleUpdateDialogOpen}>
                            Update
                        </Button>{" "}
                        {/* Step 3: Button to open the dialog */}
                        <Button color="inherit" className="mx-1">
                            Remove
                        </Button>
                        <Button color="inherit" className="mx-1">
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
            <StaffAddDialog
                open={addDialogOpen}
                onAdd={handleAddDialogClose}
                onClose={handleAddDialogClose}
            />
            <StaffUpdateDialog // Step 4
                open={updateDialogOpen}
                onUpdate={handleUpdateDialogClose}
                onClose={handleUpdateDialogClose}
            />
        </>
    );
}
