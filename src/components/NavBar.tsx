import React, {useState} from "react";
import {Link, useLocation} from "react-router-dom";
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
import {generateResourceUrl} from "../utils/utils";

// --- Tab definitions ---

const leftBaseTabs = [
    {label: "Home", href: "/"},
    {label: "Staff", href: "/staff"}
];

const leftLoggedInTabs = [
    {label: "Members", href: "/members"},
    {label: "Gear", href: "/gear"}
];

const rightLoggedInTabs = [
    {label: "Trips", href: "/trips"},
    {label: "Stats", href: "/stats"},
    {label: "Guide", href: "/guide"}
];

const adminTabs = [{label: "Admin", href: "/editstaff"}];

function determineLeftTabs(role: string | undefined) {
    let tabs = [...leftBaseTabs];
    if (role === "staff" || role === "admin") tabs = [...tabs, ...leftLoggedInTabs];
    return tabs;
}

function determineRightTabs(role: string | undefined) {
    let tabs: typeof rightLoggedInTabs = [];
    if (role === "staff" || role === "admin") tabs = [...rightLoggedInTabs];
    if (role === "admin") tabs = [...tabs, ...adminTabs];
    return tabs;
}

function allTabs(role: string | undefined) {
    return [...determineLeftTabs(role), ...determineRightTabs(role)];
}

// --- Desktop nav button ---

const NavMenu: React.FC<{tabs: {label: string; href: string}[]}> = ({tabs}) => {
    const location = useLocation();
    return (
        <>
            {tabs.map((tab) => {
                const active =
                    tab.href === "/"
                        ? location.pathname === "/"
                        : location.pathname.startsWith(tab.href);
                return (
                    <Button
                        key={tab.label}
                        component={Link}
                        to={tab.href}
                        sx={{
                            my: 1,
                            px: 1.5,
                            color: active ? "#bbf7d0" : "rgba(255,255,255,0.75)",
                            fontWeight: active ? 700 : 400,
                            fontSize: "0.9rem",
                            textTransform: "none",
                            letterSpacing: "0.01em",
                            borderBottom: active ? "2px solid #4ade80" : "2px solid transparent",
                            borderRadius: 0,
                            "&:hover": {
                                color: "white",
                                backgroundColor: "transparent",
                                borderBottom: "2px solid rgba(255,255,255,0.4)"
                            }
                        }}
                    >
                        {tab.label}
                    </Button>
                );
            })}
        </>
    );
};

function NavBar() {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const {identity} = useLogin();

    const role = identity?.role;
    const leftTabs = determineLeftTabs(role);
    const rightTabs = determineRightTabs(role);
    const mobileTabs = allTabs(role);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => setAnchorElNav(null);

    return (
        <AppBar
            position="static"
            sx={{background: "linear-gradient(180deg, #111827 0%, #1f2937 100%)", boxShadow: "0 1px 0 rgba(255,255,255,0.06)"}}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{py: 0.5, minHeight: "56px"}}>

                    {/* ── Mobile: hamburger left ── */}
                    <Box sx={{display: {xs: "flex", md: "none"}, flex: 1}}>
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
                            {mobileTabs.map((tab) => (
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

                    {/* ── Desktop: left tabs ── */}
                    <Box sx={{display: {xs: "none", md: "flex"}, flex: 1, alignItems: "center"}}>
                        <NavMenu tabs={leftTabs} />
                    </Box>

                    {/* ── Center: logo ── */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            flexShrink: 0,
                            px: {xs: 1, md: 2}
                        }}
                    >
                        <Link to="/">
                            <img
                                src={generateResourceUrl("/resources/excursionclublogo_invert.png")}
                                alt="Excursion Club"
                                style={{width: "72px", display: "block"}}
                            />
                        </Link>
                    </Box>

                    {/* ── Desktop: right tabs + login ── */}
                    <Box
                        sx={{
                            display: {xs: "none", md: "flex"},
                            flex: 1,
                            justifyContent: "flex-end",
                            alignItems: "center",
                            gap: 0.5
                        }}
                    >
                        <NavMenu tabs={rightTabs} />
                        <Box sx={{ml: 1}}>
                            <LoginButton />
                        </Box>
                    </Box>

                    {/* ── Mobile: login right ── */}
                    <Box sx={{display: {xs: "flex", md: "none"}}}>
                        <LoginButton />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;
