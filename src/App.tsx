import {Route, useLocation, Routes} from "react-router-dom";
import React, {useEffect} from "react";
import HomePage from "./pages/HomePage";

import "./index.css";
import LinkPage from "./pages/LinksPage";
import Layout from "components/Layout";
import MembersPage from "./pages/MembersPage";
import GearPage from "./pages/GearPage";
import {DataProvider} from "./utils/DataProvider";

function App() {
    const location = useLocation();
    const pathname = location.pathname;

    useEffect(() => {
        let title = "";
        let metaDescription = "";

        switch (pathname) {
            case "/":
                title = "Home";
                metaDescription = "";
                break;
            case "/qrcodelarge":
                title = "";
                metaDescription = "";
                break;
            case "/links":
                title = "Links";
                metaDescription = "";
                break;
            case "/members":
                title = "";
                metaDescription = "";
                break;
            case "/renewmemberpage":
                title = "";
                metaDescription = "";
                break;
            case "/addmemberspage":
                title = "";
                metaDescription = "";
                break;
            case "/gear":
                title = "";
                metaDescription = "";
                break;
            case "/inventory":
                title = "";
                metaDescription = "";
                break;
            case "/leftside":
                title = "";
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
        <DataProvider>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="links/*" element={<LinkPage />} />
                    <Route path="members" element={<MembersPage />} />
                    <Route path="gear" element={<GearPage />} />
                </Route>
            </Routes>
        </DataProvider>
    );
}
export default App;
