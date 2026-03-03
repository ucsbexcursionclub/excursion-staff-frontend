import GearNav from "../components/GearNav";
import GearTable from "../components/GearTable";
import React, {useMemo, useState} from "react";
import {Box, Tab, Tabs} from "@mui/material";
import {useGear} from "../providers/GearProvider";
export default function GearPage() {
    const [searchParams, setSearchParams] = useState<string>("");
    const [gearTab, setGearTab] = useState<"all" | "member" | "staff">("all");
    const {gearData} = useGear();
    const visibleGear = useMemo(() => {
        if (gearTab === "all") return gearData;
        if (gearTab === "staff") return gearData.filter((gear) => !!gear.is_staff_gear);
        return gearData.filter((gear) => !gear.is_staff_gear);
    }, [gearData, gearTab]);

    return (
        <>
            <GearNav setSearchParams={setSearchParams} />

            <Box className="mb-4 rounded-xl bg-white px-2">
                <Tabs value={gearTab} onChange={(_event, value) => setGearTab(value)}>
                    <Tab value="all" label={`All Gear (${gearData.length})`} />
                    <Tab
                        value="member"
                        label={`Member Rentals (${gearData.filter((gear) => !gear.is_staff_gear).length})`}
                    />
                    <Tab
                        value="staff"
                        label={`Staff Gear (${gearData.filter((gear) => !!gear.is_staff_gear).length})`}
                    />
                </Tabs>
            </Box>

            <GearTable searchParams={searchParams} rows={visibleGear} />
        </>
    );
}
