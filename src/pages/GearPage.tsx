import GearNav from "components/GearNav";
import GearTable from "components/GearTable";
import React from "react";
import {useQuery} from "react-query";
import {getGear} from "src/utils/api";

export default function GearPage() {
    const {data, isLoading} = useQuery("gear", getGear);

    return (
        <>
            <GearNav />
            {!isLoading && <GearTable initialData={data} />}
        </>
    );
}
