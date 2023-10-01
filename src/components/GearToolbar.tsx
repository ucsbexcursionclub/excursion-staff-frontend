import React, {useMemo, useState} from "react";
import {
    GridToolbarContainer,
    gridFilteredSortedRowEntriesSelector,
    useGridApiContext
} from "@mui/x-data-grid";
import {useGear} from "src/providers/GearProvider";
import {Typography} from "@mui/material";
import {GearProps} from "src/utils/types";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

function SelectedCount() {
    const {gearRowSelectionModel} = useGear();

    const selectedCount = useMemo(() => gearRowSelectionModel.length, [gearRowSelectionModel]);

    return (
        <div className="px-4 py-2 bg-gray-100 shadow-md rounded-2xl">
            <Typography>
                <strong>{selectedCount}</strong>
                {` Gear Selected`}
            </Typography>
        </div>
    );
}

function Separator() {
    return <div style={{minWidth: "2px", maxWidth: "2px"}} className="bg-black mx-2"></div>;
}

type AvailibilityViewProps = {
    searchParams: string;
};

function AvailibilityView({searchParams}: AvailibilityViewProps) {
    const apiRef = useGridApiContext();

    const visibleRows = gridFilteredSortedRowEntriesSelector(apiRef);

    const [availableCount, checkedOutCount, overdueCount] = useMemo(() => {
        let localAvailableCount = 0;
        let localCheckedOutCount = 0;
        let localOverdueCount = 0;

        visibleRows.map((row) => {
            const gear: GearProps = row.model as GearProps;

            gear.current_reservation ? localCheckedOutCount++ : localAvailableCount++;

            if (gear.reservationDetails?.due_date < Date.now()) {
                localOverdueCount++;
            }
        });

        return [localAvailableCount, localCheckedOutCount, localOverdueCount];
    }, [visibleRows]);

    const filter = searchParams || "All Gear";

    return (
        <div className="px-4 py-2 bg-gray-100 shadow-md rounded-2xl flex">
            <Typography>
                {"For "}
                <strong>
                    {`"`}
                    {filter}
                    {`"`}
                </strong>
            </Typography>
            <Separator />
            <Typography>
                <strong>{availableCount}</strong>
                {" Available "}
            </Typography>
            <Separator />
            <Typography>
                <strong>{checkedOutCount}</strong>
                {" Checked Out "}
            </Typography>
            <Separator />
            <Typography>
                <strong>{overdueCount}</strong>
                {" Overdue "}
            </Typography>
        </div>
    );
}

type GearToolBarProps = {
    searchParams: string;
    onFilterChange: (newSelectedFilter: string) => void; // Define the prop type
};

export default function CustomToolbar({searchParams, onFilterChange}: GearToolBarProps) {
    const [selectedFilter, setSelectedFilter] = useState("showAll");

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
        // Call the callback to update the filter in the parent component
        onFilterChange(event.target.value);
    };

    return (
        <GridToolbarContainer
            sx={{padding: "1rem"}}
            className="bg-gray-200 rounded-2xl rounded-b-none flex flex-row lg:flex-row items-center"
        >
            <FormControl sx={{minWidth: 120}}>
                <InputLabel>Select Filter</InputLabel>
                <Select value={selectedFilter} onChange={handleFilterChange} label="Select Filter">
                    <MenuItem value="showAll">Show all gear</MenuItem>
                    <MenuItem value="showOverdue">Show Overdue Only</MenuItem>
                    <MenuItem value="hideOverdue">Hide Overdue</MenuItem>
                </Select>
            </FormControl>
            <Separator />
            <SelectedCount />
            <AvailibilityView searchParams={searchParams} />
        </GridToolbarContainer>
    );
}
