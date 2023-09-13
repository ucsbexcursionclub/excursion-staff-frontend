import MembersNav from "components/MembersNav";
import MembersTable from "components/MembersTable";
import React from "react";
import {useQuery} from "react-query";
import {getMembers} from "src/utils/api";

export default function MembersPage() {
    const {data, isLoading} = useQuery("members", getMembers);

    return (
        <>
            <MembersNav />
            {!isLoading && <MembersTable initialData={data} />}
        </>
    );
}
