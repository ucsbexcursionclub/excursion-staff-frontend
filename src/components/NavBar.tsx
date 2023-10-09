import React, {useState} from "react";
import {Link} from "react-router-dom";
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Container,
    Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginButton from "./LoginButton";
import {useLogin} from "../providers/LoginProvider";

const baseTabs = [
    {label: "Home", href: "/"},
    {label: "Staff", href: "/staff"}
];

const loggedInTabs = [
    {label: "Links", href: "/links"},
    {label: "Members", href: "/members"},
    {label: "Gear", href: "/gear"}
];

const adminTabs = [{label: "Admin", href: "/editstaff"}];

function determineTabs(identityRole: string | undefined) {
    let tabs = [...baseTabs];

    if (identityRole === "staff" || identityRole === "admin") {
        tabs = [...tabs, ...loggedInTabs];
    }

    if (identityRole === "admin") {
        tabs = [...tabs, ...adminTabs];
    }

    return tabs;
}

const NavMenu: React.FC<{tabs: typeof baseTabs}> = ({tabs}) => (
    <>
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
    </>
);

function NavBar() {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const {identity} = useLogin();

    const tabs = determineTabs(identity?.role);

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
                            anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                            keepMounted
                            transformOrigin={{vertical: "top", horizontal: "left"}}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{display: {xs: "block", md: "none"}}}
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
                        <NavMenu tabs={tabs} />
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
