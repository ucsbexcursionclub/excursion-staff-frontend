import NavBar from "./NavBar";
import React from "react";
import {Outlet} from "react-router-dom";
import {Divider, Typography} from "@mui/material";

function SiteFooter() {
    return (
        <footer className="mt-10 px-4 pb-6">
            <Divider sx={{mb: 3}} />
            <div className="max-w-3xl mx-auto text-center space-y-1">
                <Typography variant="body2" sx={{color: "#6b7280"}}>
                    Questions? Reach out in the staff GroupMe or contact the current admin.
                </Typography>
                <Typography variant="subtitle2" fontWeight={700} sx={{color: "#374151"}}>
                    Marisha Kapinska &amp; Xinghan Yang
                </Typography>
                <Typography variant="caption" sx={{color: "#9ca3af"}}>
                    April 18, 2026
                </Typography>
            </div>
        </footer>
    );
}

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="p-4 flex-1">
                <Outlet />
            </div>
            <SiteFooter />
        </div>
    );
}
