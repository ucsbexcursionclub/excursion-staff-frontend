import LinkGrid from "../components/LinkGrid";
import LinkNav from "../components/LinkNav";
import {useParams} from "react-router-dom";
import React, {useState} from "react";
import { useQuery } from "react-query";
import { getLinkResources } from "../utils/api";
import { NotificationProps } from "../utils/types";
import { useSnackbar } from "../providers/SnackBarProvider";
import { useLogin } from "../providers/LoginProvider";

export default function LinkPage() {
    const {tabId} = useParams<{tabId: string}>();
    const initialTab = tabId || "prospectiveMembers"; // Get from the URL or default
    const [selectedTab, setSelectedTab] = useState(initialTab);
    const {isStaff} = useLogin();
    const {addNotification} = useSnackbar();

    const {data: linkResources} = useQuery({
        queryKey: ["linkResources"],
        enabled: isStaff,
        queryFn: getLinkResources,
        onError: (err: Error) => {
            const newNotification: NotificationProps = {
                message: err.message,
                type: "error"
            };
            addNotification(newNotification);
        }
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
