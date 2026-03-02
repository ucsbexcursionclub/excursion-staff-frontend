import MembersNav from "../components/MembersNav";
import MembersTable from "../components/MembersTable";
import React, {useState} from "react";

export default function MembersPage() {
    const [searchParams, setSearchParams] = useState("");

    return (
        <>
            <MembersNav setSearchParams={setSearchParams} />
            {<MembersTable searchParams={searchParams} />}
        </>
    );
}
