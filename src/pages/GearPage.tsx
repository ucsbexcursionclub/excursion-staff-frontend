import GearNav from "../components/GearNav";
import GearTable from "../components/GearTable";
import React, {useState} from "react";
export default function GearPage() {
    const [searchParams, setSearchParams] = useState<string>("");

    return (
        <>
            <GearNav setSearchParams={setSearchParams} />

            <GearTable searchParams={searchParams} />
        </>
    );
}
