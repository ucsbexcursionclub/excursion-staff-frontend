import {Route, useLocation, Routes} from "react-router-dom";
import React, {useEffect} from "react";
import HomePage from "./pages/HomePage";

import "./index.css";
import LinkPage from "./pages/LinksPage";
import Layout from "components/Layout";
import MembersPage from "./pages/MembersPage";
import GearPage from "./pages/GearPage";
import {GearProvider} from "./providers/GearProvider";
import {MembersProvider} from "./providers/MembersProvider";
import {ReservationsProvider} from "./providers/ReservationProvider";

function App() {
    const location = useLocation();
    const pathname = location.pathname;

    useEffect(() => {
        const root = "Excursion Club - ";
        let title = "";
        let metaDescription = "";

        switch (pathname) {
            case "/":
                title = root + "Home";
                metaDescription = "";
                break;
            case "/links":
                title = root + "Links";
                metaDescription = "";
                break;
            case "/members":
                title = root + "Members";
                metaDescription = "";
                break;
            case "/gear":
                title = root + "Gear";
                metaDescription = "";
                break;
        }

        if (title) {
            document.title = title;
        }

        if (metaDescription) {
            const metaDescriptionTag: HTMLMetaElement | null = document.querySelector(
                'head > meta[name="description"]'
            );
            if (metaDescriptionTag) {
                metaDescriptionTag.content = metaDescription;
            }
        }
    }, [pathname]);

    return (
        <ReservationsProvider>
            <MembersProvider>
                <GearProvider>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<HomePage />} />
                            <Route path="links/*" element={<LinkPage />} />
                            <Route path="members" element={<MembersPage />} />
                            <Route path="gear" element={<GearPage />} />
                        </Route>
                    </Routes>
                </GearProvider>
            </MembersProvider>
        </ReservationsProvider>
    );
}
export default App;
