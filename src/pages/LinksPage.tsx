import LinkGrid from "../components/LinkGrid";
import LinkNav from "../components/LinkNav";
import {useParams} from "react-router-dom";
import React, {useState} from "react";
import {prospectiveMembers, staffHeads, tripResources} from "../data/links";

export default function LinkPage() {
    const {tabId} = useParams<{tabId: string}>();
    const initialTab = tabId || "prospectiveMembers"; // Get from the URL or default
    const [selectedTab, setSelectedTab] = useState(initialTab);
    const tabs = [prospectiveMembers, tripResources, staffHeads];
    const currentData = tabs.find((tab) => tab.id === selectedTab);

    return (
        <div>
            <LinkNav tabs={tabs} onNavItemClicked={(index) => setSelectedTab(tabs[index].id)} />
            {currentData && <LinkGrid data={currentData} />}
        </div>
    );
}
