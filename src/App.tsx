import React, {useEffect} from "react";
import {Route, useLocation, Routes} from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import StaffPage from "./pages/StaffPage";
import EditStaffPage from "./pages/EditStaffPage";
import LinkPage from "./pages/LinksPage";
import Layout from "./components/Layout";
import MembersPage from "./pages/MembersPage";
import GearPage from "./pages/GearPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

// Providers
import {GearProvider} from "./providers/GearProvider";
import {MembersProvider} from "./providers/MembersProvider";
import {ReservationsProvider} from "./providers/ReservationProvider";
import {useLogin} from "./providers/LoginProvider";
import {StaffProvider} from "./providers/StaffProvider";

function updateDocumentMetadata(pathname: string) {
    const root = "Excursion Club - ";
    const metaDescription = ""; // default empty

    const titles: Record<string, string> = {
        "/": root + "Home",
        "/staff": root + "Staff",
        "/links": root + "Links",
        "/members": root + "Members",
        "/gear": root + "Gear",
        "/admin": root + "Admin"
    };

    const title = titles[pathname] || null;

    if (title) {
        document.title = title;
    }

    const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
    ) as HTMLMetaElement;
    if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
    }
}

function App() {
    const location = useLocation();
    const {identity} = useLogin();

    useEffect(() => {
        updateDocumentMetadata(location.pathname);
    }, [location.pathname, identity]);

    const isAdmin = identity?.role === "admin";
    const isStaffOrAdmin = !!identity && ["staff", "admin"].includes(identity.role);

    return (
        <ReservationsProvider>
            <StaffProvider>
                <MembersProvider>
                    <GearProvider>
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route index element={<HomePage />} />
                                <Route path="staff" element={<StaffPage />} />

                                {isStaffOrAdmin && (
                                    <>
                                        <Route path="links/*" element={<LinkPage />} />
                                        <Route path="members" element={<MembersPage />} />
                                        <Route path="gear" element={<GearPage />} />
                                    </>
                                )}

                                {isAdmin && <Route path="editstaff" element={<EditStaffPage />} />}

                                <Route path="*" element={<UnauthorizedPage />} />
                            </Route>
                        </Routes>
                    </GearProvider>
                </MembersProvider>
            </StaffProvider>
        </ReservationsProvider>
    );
}

export default App;
