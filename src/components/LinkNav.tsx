import * as React from "react";
import {Link} from "react-router-dom";
import Box from "@mui/material/Box";
import {linkGroupType} from "../data/links";

interface Props {
    tabs: linkGroupType[];
    onNavItemClicked: (index: number) => void;
}

// LinkNav.tsx

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

export default function LinkNav({tabs, onNavItemClicked}: Props) {
    const handleChange = (newValue: number) => {
        onNavItemClicked(newValue);
    };

    return (
        <AppBar position="static" className="bg-lime-100 rounded-xl">
            <Container maxWidth="xl">
                <Toolbar disableGutters className="flex justify-between">
                    <Box sx={{display: "flex", minHeight: "32px"}}>
                        {tabs.map((tab, index) => (
                            <Button
                                key={tab.id}
                                onClick={() => handleChange(index)}
                                component={Link}
                                to={`/links/${tab.id}`}
                                sx={{
                                    my: 2,
                                    color: "white",
                                    display: "block",
                                    marginLeft: "20px",
                                    fontSize: {xs: "12px", sm: "16px", md: "20px", lg: "20px"}
                                }}
                            >
                                {tab.title}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
