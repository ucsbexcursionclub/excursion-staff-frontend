import React from "react";
import {Link} from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import LoginButton from "./LoginButton";
import {useLogin} from "src/providers/LoginProvider";

const baseTabs = [{label: "Home", href: "/"}];

const loggedInTabs = [
    {label: "Links", href: "/links"},
    {label: "Members", href: "/members"},
    {label: "Gear", href: "/gear"}
];

function NavBar() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const {isLoggedIn} = useLogin();

    const tabs = isLoggedIn ? [...baseTabs, ...loggedInTabs] : baseTabs;

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static" className="bg-lime-200">
            <Container maxWidth="xl">
                <Toolbar disableGutters className="flex justify-between py-2">
                    <Box sx={{display: {xs: "flex", md: "none"}}}>
                        <IconButton
                            size="large"
                            aria-label="open navbar menu"
                            aria-controls="menu-navbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-navbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left"
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left"
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: {xs: "block", md: "none"}
                            }}
                        >
                            {tabs.map((tab) => (
                                <MenuItem
                                    key={tab.label}
                                    onClick={handleCloseNavMenu}
                                    component={Link}
                                    to={tab.href}
                                >
                                    <Typography textAlign="center">{tab.label}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{display: {xs: "none", md: "flex"}}}>
                        {tabs.map((tab) => (
                            <Button
                                key={tab.label}
                                component={Link}
                                to={tab.href}
                                className="text-xl"
                                sx={{my: 2, color: "white", display: "block"}}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </Box>
                    <img
                        src="https://d36olvmp8krees.cloudfront.net/resources/excursionclublogo_invert.png"
                        className="w-20"
                    />
                    <Box sx={{flexGrow: 0}}>
                        <LoginButton />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;
