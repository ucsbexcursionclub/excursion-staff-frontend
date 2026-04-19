import React, {useState} from "react";
import {
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Divider,
    Paper,
    Tab,
    Tabs,
    Box,
    Grid
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
import BackpackIcon from "@mui/icons-material/Backpack";
import ExploreIcon from "@mui/icons-material/Explore";
import BarChartIcon from "@mui/icons-material/BarChart";
import LinkIcon from "@mui/icons-material/Link";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LoginIcon from "@mui/icons-material/Login";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import {useQuery} from "@tanstack/react-query";
import {getLinkResources} from "../utils/api";
import {useLogin} from "../providers/LoginProvider";
import {LinkGroupType} from "../data/links";
import {styled} from "@mui/material/styles";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = {
    title: string;
    detail: string;
};

type Section = {
    id: string;
    icon: React.ReactNode;
    title: string;
    badge?: string;
    color: string;
    intro: string;
    steps: Step[];
    tips?: string[];
};

// ─── Guide content ────────────────────────────────────────────────────────────

const sections: Section[] = [
    {
        id: "getting-started",
        icon: <LoginIcon />,
        title: "Getting Started",
        color: "#3b82f6",
        intro:
            "Before you can access staff features you need to log in with an authorized Google account.",
        steps: [
            {
                title: "Sign in",
                detail:
                    'Click the "Sign In" button in the top-right corner of the navigation bar. Use the Google account that is registered as a staff or admin account.'
            },
            {
                title: "Verify access",
                detail:
                    "Once signed in, staff-only tabs — Members, Gear, Trips, Stats, and Guide — will appear in the navigation bar. If you only see Home and Staff, your account has not been granted staff access yet."
            },
            {
                title: "Contact an admin",
                detail:
                    "If you should have staff access but don't, ask a current admin to add your Google email in the Admin panel under Edit Staff."
            }
        ],
        tips: [
            "You stay logged in across page refreshes. You only need to sign in once per session.",
            "On mobile, the nav links are hidden behind the hamburger menu in the top-left corner."
        ]
    },
    {
        id: "members",
        icon: <PeopleIcon />,
        title: "Members",
        color: "#22c55e",
        intro:
            "The Members page lets you view, add, renew, search, and manage club members.",
        steps: [
            {
                title: "Search members",
                detail:
                    "Type any part of a member's name, email, or phone number into the search bar at the top. Results filter in real time as you type — no need to press Enter or click Search. Use the ✕ button to clear the search instantly."
            },
            {
                title: "Add or renew a member",
                detail:
                    'Click "Add / Renew Member". Fill in the member\'s name, email, and phone number. Choose the membership duration (3 months, 6 months, or 1 year). For renewals, search for the existing member and their expiration date will be extended from today.'
            },
            {
                title: "View a member's profile",
                detail:
                    "Click the member's name link (blue, underlined) in the table to open their full profile page. The profile shows their membership status, checkout history, and any staff comments."
            },
            {
                title: "Edit member details",
                detail:
                    "Click the pencil icon in the Edit column of any row. A dialog opens where you can update the member's name, email, phone, and other fields."
            },
            {
                title: "Flag a member",
                detail:
                    'Click the flag icon in the Flag column to mark a member. Flagged members display a red flag. Use the "Flagged Only" toggle in the table toolbar to filter the list to flagged members only.'
            },
            {
                title: "Filter the list",
                detail:
                    'Use the "Select Filter" dropdown in the table toolbar to show: All, Active Members, Expired Members, or Members with Overdue Gear.'
            },
            {
                title: "Select and remove members",
                detail:
                    'Check the boxes to the left of rows to select members. Then click "Remove Member(s)" in the nav bar. You will be prompted to confirm before anything is deleted.'
            },
            {
                title: "Copy emails",
                detail:
                    'Select one or more members using the checkboxes, then click "Copy Emails" to copy their email addresses to your clipboard.'
            }
        ],
        tips: [
            "The member count stats bar (Active / Expired / Overdue Gear) at the top of the table always reflects the currently filtered view.",
            "If a member is both expired and flagged, use the Flagged Only toggle combined with the Expired filter to narrow results quickly."
        ]
    },
    {
        id: "gear",
        icon: <BackpackIcon />,
        title: "Gear",
        color: "#f59e0b",
        intro:
            "The Gear page manages the club's equipment inventory — member rentals and staff gear.",
        steps: [
            {
                title: "Search gear",
                detail:
                    "Type any part of a gear item's name in the search bar. The table filters instantly as you type. Use the ✕ button to clear."
            },
            {
                title: "Check out gear to a member",
                detail:
                    'Select one or more gear items using the checkboxes, then click "Check Out". In the dialog, start typing the member\'s name — the autocomplete will suggest matching members as you type (no need to spell the full name). Select the correct member and confirm.'
            },
            {
                title: "Check in returned gear",
                detail:
                    'Select the gear items being returned and click "Check In". Confirm to close the reservation and mark the gear as available.'
            },
            {
                title: "Add new gear",
                detail:
                    'Click "Add Gear" and fill in the gear name, description, and type (Member Rental or Staff Gear). Staff Gear is visible only on the Staff Gear tab.'
            },
            {
                title: "Remove gear",
                detail:
                    'Select gear items and click "Remove Gear". Confirm in the dialog. Only remove gear that is no longer in the club\'s inventory.'
            },
            {
                title: "Filter gear",
                detail:
                    'Use the "Select Filter" dropdown in the toolbar: Show All, Show Available (not checked out), Show Overdue Only, or Hide Overdue.'
            },
            {
                title: "Gear tabs",
                detail:
                    "At the top of the Gear page there are three tabs: All Gear, Member Gear, and Staff Gear. Use these to quickly narrow the view."
            },
            {
                title: "Copy member contacts",
                detail:
                    'Select checked-out gear and use "Copy Emails" or "Copy Phones" to copy the contact info for the members who have that gear.'
            }
        ],
        tips: [
            "The member autocomplete in Check Out searches as you type — you no longer need to enter the full name.",
            "If gear shows as overdue, contact the member using the copied email or phone before removing the reservation.",
            "Broken gear can be marked in the gear details dialog. It will trigger a warning if someone attempts to check it out."
        ]
    },
    {
        id: "trips",
        icon: <ExploreIcon />,
        title: "Trips",
        color: "#8b5cf6",
        intro:
            "The Trips page tracks club-organized day trips and overnight trips.",
        steps: [
            {
                title: "View trips",
                detail:
                    "Use the All / Day Trips / Overnight tabs at the top to filter trip type. The table shows trip name, date, location, and participant count."
            },
            {
                title: "Add a trip",
                detail:
                    'Click "Add Trip" in the nav bar. Fill in the trip name, location, date, type (day or overnight), and any notes.'
            },
            {
                title: "Edit a trip",
                detail:
                    "Click the pencil icon on any row to open the trip details dialog where you can update any field."
            },
            {
                title: "Delete trips",
                detail:
                    'Select trips using the checkboxes and click "Remove Trip(s)". Confirm the deletion in the dialog.'
            }
        ],
        tips: [
            "Trip records are useful for end-of-year stats reporting — keep them up to date after each event."
        ]
    },
    {
        id: "stats",
        icon: <BarChartIcon />,
        title: "Stats",
        color: "#ec4899",
        intro:
            "The Stats page (also accessible at /income) shows membership revenue and signup trends.",
        steps: [
            {
                title: "View income",
                detail:
                    "The page displays total revenue grouped by membership duration and a time-series chart of signups and renewals."
            },
            {
                title: "Filter by date range",
                detail:
                    "Use the date pickers to narrow the stats to a specific period — useful for quarterly or annual reporting."
            }
        ],
        tips: [
            "The Stats page is read-only — no data can be modified here.",
            "Bookmark /income if you prefer the shorter URL."
        ]
    },
    {
        id: "admin",
        icon: <AdminPanelSettingsIcon />,
        title: "Admin — Edit Staff",
        badge: "Admin only",
        color: "#ef4444",
        intro:
            "The Admin page (visible only to admins) lets you manage who has staff or admin access.",
        steps: [
            {
                title: "Add a staff member",
                detail:
                    'Click "Add Staff". Enter the person\'s name and Google email address. Assign them a role: staff (standard access) or admin (full access including this page).'
            },
            {
                title: "Edit a staff member",
                detail:
                    "Click the pencil icon on a staff card to edit their name, email, photo, or role."
            },
            {
                title: "Remove a staff member",
                detail:
                    'Select one or more staff cards and click "Remove Staff". This revokes their login access immediately.'
            }
        ],
        tips: [
            "Only grant admin access to people who need it — admins can add or remove other admins.",
            "After adding a new staff member, they can log in immediately with their Google account."
        ]
    }
];

// ─── Guide section card ───────────────────────────────────────────────────────

function SectionCard({section}: {section: Section}) {
    const [expanded, setExpanded] = useState<string | false>(false);

    return (
        <Paper
            elevation={0}
            sx={{border: "1px solid #e5e7eb", borderRadius: "16px", overflow: "hidden", mb: 3}}
        >
            <div
                className="flex items-center gap-3 px-6 py-4"
                style={{
                    background: `linear-gradient(135deg, ${section.color}18 0%, ${section.color}08 100%)`,
                    borderBottom: "1px solid #e5e7eb"
                }}
            >
                <span style={{color: section.color, display: "flex", alignItems: "center"}}>
                    {section.icon}
                </span>
                <Typography variant="h6" fontWeight={700} sx={{color: "#111827"}}>
                    {section.title}
                </Typography>
                {section.badge && (
                    <Chip
                        label={section.badge}
                        size="small"
                        sx={{backgroundColor: "#fee2e2", color: "#991b1b", fontWeight: 600, fontSize: "0.7rem"}}
                    />
                )}
            </div>

            <div className="px-6 py-4">
                <Typography variant="body2" sx={{color: "#4b5563", mb: 3}}>
                    {section.intro}
                </Typography>

                <div className="space-y-1">
                    {section.steps.map((step, idx) => (
                        <Accordion
                            key={step.title}
                            expanded={expanded === `step-${idx}`}
                            onChange={(_, isExpanded) =>
                                setExpanded(isExpanded ? `step-${idx}` : false)
                            }
                            elevation={0}
                            sx={{
                                border: "1px solid #f3f4f6",
                                borderRadius: "10px !important",
                                mb: 1,
                                "&:before": {display: "none"},
                                "&.Mui-expanded": {border: `1px solid ${section.color}40`}
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{minHeight: "44px", "& .MuiAccordionSummary-content": {my: 0.5}}}
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="flex items-center justify-center rounded-full text-xs font-bold w-5 h-5 shrink-0"
                                        style={{backgroundColor: `${section.color}20`, color: section.color}}
                                    >
                                        {idx + 1}
                                    </span>
                                    <Typography variant="body2" fontWeight={600} sx={{color: "#374151"}}>
                                        {step.title}
                                    </Typography>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails sx={{pt: 0, pb: 1.5, px: 2}}>
                                <Typography
                                    variant="body2"
                                    sx={{color: "#6b7280", ml: "28px", lineHeight: 1.6}}
                                >
                                    {step.detail}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>

                {section.tips && section.tips.length > 0 && (
                    <div
                        className="mt-4 rounded-xl p-4"
                        style={{
                            backgroundColor: `${section.color}08`,
                            border: `1px solid ${section.color}20`
                        }}
                    >
                        <div className="flex items-center gap-1.5 mb-2">
                            <TipsAndUpdatesIcon sx={{fontSize: 16, color: section.color}} />
                            <Typography variant="caption" fontWeight={700} sx={{color: section.color}}>
                                Tips
                            </Typography>
                        </div>
                        <ul className="space-y-1 pl-1">
                            {section.tips.map((tip) => (
                                <li key={tip} className="flex gap-2">
                                    <span
                                        className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full"
                                        style={{backgroundColor: section.color}}
                                    />
                                    <Typography variant="caption" sx={{color: "#4b5563", lineHeight: 1.6}}>
                                        {tip}
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </Paper>
    );
}

// ─── Resources tab ────────────────────────────────────────────────────────────

const LinkCard = styled("a")({
    display: "block",
    textDecoration: "none",
    color: "inherit",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    padding: "12px 16px",
    transition: "box-shadow 0.15s, border-color 0.15s, transform 0.15s",
    "&:hover": {
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        borderColor: "#a3e635",
        transform: "translateY(-1px)"
    }
});

function ResourcesTab({linkResources}: {linkResources: LinkGroupType[]}) {
    const [selectedGroup, setSelectedGroup] = useState(0);
    const current = linkResources[selectedGroup];

    return (
        <div>
            {/* Group pills */}
            <div className="flex flex-wrap gap-2 mb-6">
                {linkResources.map((group, i) => (
                    <Chip
                        key={group.id}
                        label={group.title}
                        icon={<LinkIcon style={{fontSize: 16}} />}
                        onClick={() => setSelectedGroup(i)}
                        sx={{
                            cursor: "pointer",
                            fontWeight: i === selectedGroup ? 700 : 400,
                            backgroundColor: i === selectedGroup ? "#d9f99d" : "#f3f4f6",
                            color: i === selectedGroup ? "#14532d" : "#374151",
                            border: i === selectedGroup ? "1.5px solid #86efac" : "1.5px solid transparent",
                            "&:hover": {backgroundColor: i === selectedGroup ? "#d9f99d" : "#e5e7eb"}
                        }}
                    />
                ))}
            </div>

            {current && (
                <>
                    <Typography variant="h6" fontWeight={700} sx={{color: "#111827", mb: 3}}>
                        {current.title}
                    </Typography>
                    <Grid container spacing={2}>
                        {current.links.map((item, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <LinkCard href={item.href} target="_blank" rel="noopener noreferrer">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            style={{width: 40, height: 40, objectFit: "contain", flexShrink: 0}}
                                        />
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1">
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={600}
                                                    noWrap
                                                    sx={{color: "#111827"}}
                                                >
                                                    {item.title}
                                                </Typography>
                                                <OpenInNewIcon sx={{fontSize: 12, color: "#9ca3af", flexShrink: 0}} />
                                            </div>
                                            <Typography
                                                variant="caption"
                                                sx={{color: "#6b7280", lineHeight: 1.4, display: "block"}}
                                            >
                                                {item.description}
                                            </Typography>
                                        </div>
                                    </div>
                                </LinkCard>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function GuidePage() {
    const [mainTab, setMainTab] = useState(0);
    const {isStaff} = useLogin();

    const {data: linkResources} = useQuery({
        queryKey: ["linkResources"],
        enabled: isStaff,
        queryFn: getLinkResources
    });

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            {/* Hero */}
            <div
                className="rounded-2xl px-8 py-8 mb-6"
                style={{background: "linear-gradient(135deg, #d9f99d 0%, #bbf7d0 60%, #a7f3d0 100%)"}}
            >
                <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{color: "#14532d", letterSpacing: "-0.5px", mb: 1}}
                >
                    Staff Guide &amp; Resources
                </Typography>
                <Typography variant="body1" sx={{color: "#166534", maxWidth: 480}}>
                    How-to instructions for every feature, plus quick links to all club resources —
                    all in one place.
                </Typography>
            </div>

            {/* Top-level tabs */}
            <Box sx={{borderBottom: "1px solid #e5e7eb", mb: 4}}>
                <Tabs
                    value={mainTab}
                    onChange={(_, v) => setMainTab(v)}
                    TabIndicatorProps={{style: {backgroundColor: "#22c55e", height: 3}}}
                    sx={{"& .MuiTab-root": {textTransform: "none", fontWeight: 600, fontSize: "0.95rem"}}}
                >
                    <Tab label="How to Use" />
                    <Tab label="Resources" />
                </Tabs>
            </Box>

            {/* ── How to Use tab ── */}
            {mainTab === 0 && (
                <>
                    {/* Quick nav pills */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {sections.map((s) => (
                            <a
                                key={s.id}
                                href={`#${s.id}`}
                                className="no-underline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(s.id)?.scrollIntoView({behavior: "smooth"});
                                }}
                            >
                                <Chip
                                    icon={<span style={{color: s.color, display: "flex"}}>{s.icon}</span>}
                                    label={s.title}
                                    size="small"
                                    sx={{
                                        cursor: "pointer",
                                        backgroundColor: `${s.color}12`,
                                        color: "#374151",
                                        border: `1px solid ${s.color}30`,
                                        fontWeight: 500,
                                        "&:hover": {backgroundColor: `${s.color}22`}
                                    }}
                                />
                            </a>
                        ))}
                    </div>

                    <Divider sx={{mb: 4}} />

                    {sections.map((section) => (
                        <div key={section.id} id={section.id}>
                            <SectionCard section={section} />
                        </div>
                    ))}

                </>
            )}

            {/* ── Resources tab ── */}
            {mainTab === 1 && (
                <>
                    {linkResources && linkResources.length > 0 ? (
                        <ResourcesTab linkResources={linkResources} />
                    ) : (
                        <div className="flex items-center justify-center py-16">
                            <Typography sx={{color: "#9ca3af"}}>Loading resources…</Typography>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
