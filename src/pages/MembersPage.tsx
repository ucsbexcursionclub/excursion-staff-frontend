import MembersNav from "components/MembersNav";
import MembersTable from "components/MembersTable";
import React from "react";
import {useData} from "src/utils/DataProvider";

export default function MembersPage() {
    const {membersData} = useData();

    return (
        <>
            <MembersNav />
            {<MembersTable initialData={membersData} />}
        </>
    );
}
