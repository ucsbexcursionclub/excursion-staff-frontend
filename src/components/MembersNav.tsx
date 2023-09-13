import React from "react";
import {AppBar, Toolbar, Typography, InputBase, Button} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function MembersNav() {
    return (
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
                    <Button color="inherit" className="mx-1">
                        Add Member
                    </Button>
                    <Button color="inherit" className="mx-1">
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
    );
}
