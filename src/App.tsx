import React, {useEffect} from "react";
import {Route, useLocation, Routes} from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import StaffPage from "./pages/StaffPage";
import EditStaffPage from "./pages/EditStaffPage";
import Layout from "./components/Layout";
import MembersPage from "./pages/MembersPage";
import GearPage from "./pages/GearPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import StatsPage from "./pages/StatsPage";
import MemberProfilePage from "./pages/MemberProfilePage";
import TripsPage from "./pages/TripsPage";
import GuidePage from "./pages/GuidePage";
import {Navigate} from "react-router-dom";

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
        "/members": root + "Members",
        "/gear": root + "Gear",
        "/stats": root + "Stats",
        "/trips": root + "Trips",
        "/guide": root + "Staff Guide",
        "/editstaff": root + "Admin"
    };

    const title = pathname.startsWith("/members/")
        ? root + "Member Profile"
        : titles[pathname] || null;

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
                                        {/* /links redirects to /guide (Resources tab) */}
                                        <Route path="links/*" element={<Navigate to="/guide" replace />} />
                                        <Route path="members" element={<MembersPage />} />
                                        <Route path="members/:memberId" element={<MemberProfilePage />} />
                                        <Route path="gear" element={<GearPage />} />
                                        <Route path="trips" element={<TripsPage />} />
                                        <Route path="stats" element={<StatsPage />} />
                                        {/* Back-compat: keep /income working */}
                                        <Route path="income" element={<StatsPage />} />
                                        <Route path="guide" element={<GuidePage />} />
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
