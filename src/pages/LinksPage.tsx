import LinkGrid from "../components/LinkGrid";
import LinkNav from "../components/LinkNav";
import {useParams} from "react-router-dom";
import React, {useState} from "react";
import { useQuery } from "@tanstack/react-query";
import { getLinkResources } from "../utils/api";
import { useLogin } from "../providers/LoginProvider";

export default function LinkPage() {
    const {tabId} = useParams<{tabId: string}>();
    const initialTab = tabId || "prospectiveMembers"; // Get from the URL or default
    const [selectedTab, setSelectedTab] = useState(initialTab);
    const {isStaff} = useLogin();

    const {data: linkResources} = useQuery({
        queryKey: ["linkResources"],
        enabled: isStaff,
        queryFn: getLinkResources
    });

    if (!linkResources) return;

    const currentData = linkResources.find((linkResourceGroup) => linkResourceGroup.id === selectedTab);

    return (
        <div>
            <LinkNav tabs={linkResources} onNavItemClicked={(index) => setSelectedTab(linkResources[index].id)} />
            {currentData && <LinkGrid data={currentData} />}
        </div>
    );
}
