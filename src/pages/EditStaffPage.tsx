import StaffNav from "components/StaffNav";
import StaffTable from "components/StaffTable";
import React, {useState} from "react";

export default function EditStaffPage() {
    const [searchParams, setSearchParams] = useState<string>();

    return (
        <>
            <StaffNav setSearchParams={setSearchParams} />
            {<StaffTable searchParams={searchParams} />}
        </>
    );
}
