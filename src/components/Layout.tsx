import NavBar from "components/NavBar";
import React from "react";
import {Outlet} from "react-router-dom";

export default function Layout() {
    return (
        <>
            <NavBar />
            <div className="p-4" style={{padding: 0}}>
                <Outlet />
            </div>
        </>
    );
}
