import React, {useState} from "react";
import {AppBar, Toolbar, Typography, InputBase, Button} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddMemberDialogue from "./AddMemberDialogue";
import RemoveMemberDialog from "./RemoveMemberDialog";

export default function MembersNav() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

    const handleAddMemberClick = () => {
        setIsDialogOpen(true);
    };

    const handleRemoveMemberClick = () => {
        setIsRemoveDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setIsRemoveDialogOpen(false);
    };

    const handleConfirmRemove = async () => {
        console.log("Members removed successfully.");
        // try {
        //   // Make an API request to remove the selected members
        //   const response = await fetch("/api/remove-members", {
        //     method: "POST",
        //     body: JSON.stringify({ memberIds: selectedMembers }), // Pass the selected member IDs to the server
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //   });

        //   if (response.ok) {
        //     // Removal was successful
        //     console.log("Members removed successfully.");
        //   } else {
        //     // Handle error cases here, e.g., display an error message to the user
        //     console.error("Failed to remove members.");
        //   }
        // } catch (error) {
        //   // Handle network errors or other exceptions
        //   console.error("An error occurred while removing members:", error);
        // }

        // Close the confirmation dialog
        setIsRemoveDialogOpen(false);

        // // Clear the selected members
        // setSelectedMembers([]);
    };

    return (
        <div>
            <AppBar position="static" className="rounded-xl mb-4 bg-lime-100">
                <Toolbar className="flex justify-between items-center">
                    <Typography variant="h4">Members</Typography>
                    <div className="relative flex items-center mx-2 bg-peel-100 rounded-lg border-8 border-gray-200">
                        <SearchIcon className="absolute left-2" />
                        <InputBase placeholder="Search by name…" className="pl-10" />
                        <Button color="inherit" className="rounded-lg text-sm bg-lime-200">
                            Search
                        </Button>
                    </div>
                    <div className="flex">
                        <Button color="inherit" className="mx-1" onClick={handleAddMemberClick}>
                            Add Member
                        </Button>
                        <Button color="inherit" className="mx-1" onClick={handleRemoveMemberClick}>
                            Remove Member(s)
                        </Button>
                        <Button color="inherit" className="mx-1">
                            Edit Member
                        </Button>
                        <Button color="inherit" className="mx-1">
                            Copy Email(s)
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <AddMemberDialogue
                open={isDialogOpen}
                onClose={handleCloseDialog}
                onOpen={handleAddMemberClick} // Pass the handler to open the dialog
            />
            <RemoveMemberDialog
                open={isRemoveDialogOpen}
                onClose={handleCloseDialog}
                onOpen={handleRemoveMemberClick} // Pass the handler to open the dialog
                onConfirm={handleConfirmRemove}
                memberNames={["test1,test2"]}
            />
        </div>
    );
}
