import MembersNav from "components/MembersNav";
import MembersTable from "components/MembersTable";
import React from "react";
import {useMembers} from "src/providers/MembersProvider";

export default function MembersPage() {
    const {membersData} = useMembers();

    return (
        <>
            <MembersNav />
            {<MembersTable initialData={membersData} />}
        </>
    );
}
