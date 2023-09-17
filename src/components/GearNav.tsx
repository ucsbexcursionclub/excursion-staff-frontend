import React from "react";
import {AppBar, Toolbar, Typography, InputBase, Button} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function GearNav() {
    return (
        <AppBar position="static" className="rounded-xl mb-4 bg-lime-100">
            <Toolbar className="flex justify-between items-center py-1">
                <Typography variant="h4">Gear</Typography>
                <div className="flex flex-col items-center">
                    <Typography
                        style={{userSelect: "none"}}
                        className="text-xs text-gray-300 text-opacity-0 pointer-events-none"
                    >
                        s
                    </Typography>
                    <div className="relative flex items-center mx-2 bg-peel-100 rounded-lg">
                        <SearchIcon className="absolute left-2" color="inherit" />
                        <InputBase className="pl-10" />
                        <Button color="inherit" className="rounded-lg text-sm bg-lime-200">
                            Search
                        </Button>
                    </div>
                    <Typography className="text-xs text-gray-200 italic">
                        Gear Name or RFID
                    </Typography>
                </div>
                <div className="flex">
                    <Button color="inherit" className="mx-1">
                        Check In
                    </Button>
                    <Button color="inherit" className="mx-1">
                        Check Out
                    </Button>
                    <Button color="inherit" className="">
                        Add Gear
                    </Button>
                    <Button color="inherit" className="">
                        Remove Gear
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    );
}
