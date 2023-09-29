import {Route, useLocation, Routes} from "react-router-dom";
import React, {useEffect} from "react";
import HomePage from "./pages/HomePage";
import StaffPage from "./pages/StaffPage";
import EditStaffPage from "./pages/EditStaffPage";
import "./index.css";
import LinkPage from "./pages/LinksPage";
import Layout from "components/Layout";
import MembersPage from "./pages/MembersPage";
import GearPage from "./pages/GearPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import {GearProvider} from "./providers/GearProvider";
import {MembersProvider} from "./providers/MembersProvider";
import {ReservationsProvider} from "./providers/ReservationProvider";
import {useLogin} from "./providers/LoginProvider";
import {StaffProvider} from "./providers/StaffProvider";

declare module "@mui/material" {
    interface ModalComponentsPropsOverrides {
        open: boolean;
        onClose: () => void;
    }
}

function App() {
    const location = useLocation();
    const {isLoggedIn} = useLogin();

    useEffect(() => {
        updateDocumentMetadata(location.pathname, isLoggedIn);
    }, [location.pathname, isLoggedIn]);

    const updateDocumentMetadata = (pathname: string, loggedIn: boolean) => {
        const root = "Excursion Club - ";
        let title;
        const metaDescription = ""; // default empty

        if (pathname === "/") {
            title = root + "Home";
        } else if (pathname === "/staff") {
            title = root + "Staff";
        } else if (loggedIn) {
            switch (pathname) {
                case "/links":
                    title = root + "Links";
                    break;
                case "/members":
                    title = root + "Members";
                    break;
                case "/gear":
                    title = root + "Gear";
                    break;
                default:
                    break;
            }
        }

        if (title) {
            document.title = title;
        }

        const metaDescriptionTag = document.querySelector(
            'head > meta[name="description"]'
        ) as HTMLMetaElement;
        if (metaDescriptionTag) {
            metaDescriptionTag.content = metaDescription;
        }
    };

    return (
        <ReservationsProvider>
            <MembersProvider>
                <StaffProvider>
                    <GearProvider>
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route index element={<HomePage />} />
                                <Route path="staff" element={<StaffPage />} />
                                {isLoggedIn ? (
                                    <>
                                        <Route path="links/*" element={<LinkPage />} />
                                        <Route path="members" element={<MembersPage />} />
                                        <Route path="gear" element={<GearPage />} />
                                        <Route path="editstaff" element={<EditStaffPage />} />
                                    </>
                                ) : (
                                    <Route path="*" element={<UnauthorizedPage />} />
                                )}
                            </Route>
                        </Routes>
                    </GearProvider>
                </StaffProvider>
            </MembersProvider>
        </ReservationsProvider>
    );
}
export default App;
