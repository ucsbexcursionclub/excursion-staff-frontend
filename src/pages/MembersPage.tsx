import MembersNav from "components/MembersNav";
import MembersTable from "components/MembersTable";
import React, {useState} from "react";

export default function MembersPage() {
    const [searchParams, setSearchParams] = useState<string>();
    const [filter, setFilter] = useState("all"); // Initialize the filter state

    return (
        <>
            <MembersNav setSearchParams={setSearchParams} setFilter={setFilter} />
            {<MembersTable searchParams={searchParams} filter={filter} />}
        </>
    );
}
