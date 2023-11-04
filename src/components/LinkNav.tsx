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
                <Toolbar disableGutters className="flex flex-wrap max-[700px]:justify-center">
                    {tabs.map((tab, index) => (
                        <Button
                            key={tab.id}
                            onClick={() => handleChange(index)}
                            component={Link}
                            className="text-white"
                            to={`/links/${tab.id}`}
                            sx={{
                                fontSize: {xs: "16px", sm: "18px", md: "20px", lg: "20px"}
                            }}
                        >
                            {tab.title}
                        </Button>
                    ))}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
