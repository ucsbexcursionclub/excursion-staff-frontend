import React, {ChangeEvent, useState, useEffect} from "react";
import {AppBar, Toolbar, Typography, InputBase, Button} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MemberAddDialog from "src/components/MemberAddDialog";
import MemberRemoveDialog from "src/components/MemberRemoveDialog";
import FailMemberRemoveDialog from "src/components/FailMemberRemoveDialog";
import {useMembers} from "src/providers/MembersProvider";
import MemberEmailDialog from "./MemberEmailDialog";

type MembersNavProps = {
    setSearchParams: React.Dispatch<React.SetStateAction<string>>;
};

export default function MembersNav({setSearchParams}: MembersNavProps) {
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false);
    const [failRemoveDialogOpen, setFailRemoveDialogOpen] = useState<boolean>(false);
    const [copyEmailOpen, setCopyEmailOpen] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Initialize with the current window width

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

    return (
        <>
            <AppBar position="static" className="rounded-xl mb-4 bg-lime-100">
                <Toolbar className="flex justify-between items-center py-1">
                    <Typography variant="h4">Members</Typography>
                    <div className="flex flex-col items-center">
                        <Typography
                            style={{userSelect: "none"}}
                            className="text-xs text-gray-300 text-opacity-0 pointer-events-none"
                        >
                            s
                        </Typography>
                        <div className="relative flex items-center mx-2 bg-peel-100 rounded-lg">
                            <SearchIcon className="absolute left-2" color="inherit" />
                            <InputBase onChange={updateSearch} className="pl-10" />
                            <Button color="inherit" className="rounded-lg text-sm bg-lime-200">
                                Search
                            </Button>
                        </div>
                        <Typography className="text-xs text-gray-200 italic">
                            Name, Email, or Phone Number
                        </Typography>
                    </div>
                    <div className="flex">
                        <Button color="inherit" className="" onClick={handleOpenAddDialog}>
                            Add/Renew Member
                        </Button>
                        <Button color="inherit" className="" onClick={handleRemoveClick}>
                            Remove Member(s)
                        </Button>
                        <Button color="inherit" className="mx-1" onClick={handleOpenCopyEmail}>
                            Copy Email(s)
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
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
