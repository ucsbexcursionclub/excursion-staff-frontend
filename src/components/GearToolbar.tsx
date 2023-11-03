import React, {useMemo, useState} from "react";
import {
    GridToolbarContainer,
    gridFilteredSortedRowEntriesSelector,
    useGridApiContext
} from "@mui/x-data-grid";
import {useGear} from "../providers/GearProvider";
import Typography from "@mui/material/Typography";
import {GearProps} from "../utils/types";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {GearFilterOptions} from "../utils/constants";

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

type AvailibilityViewProps = {
    searchParams: string;
};

type FilterSelectProps = {
    onFilterChange: React.Dispatch<React.SetStateAction<GearFilterOptions>>;
};
function FilterSelect({onFilterChange}: FilterSelectProps) {
    const [selectedFilter, setSelectedFilter] = useState<GearFilterOptions>(
        GearFilterOptions.SHOW_ALL
    );

    const handleFilterChange = (event: SelectChangeEvent<GearFilterOptions>) => {
        setSelectedFilter(event.target.value as GearFilterOptions);
        onFilterChange(event.target.value as GearFilterOptions);
    };

    return (
        <FormControl sx={{minWidth: 120}}>
            <InputLabel>Select Filter</InputLabel>
            <Select
                sx={{"& .MuiSelect-select": {padding: 1.1}}}
                className="rounded-2xl bg-gray-100 shadow-md border-none pl-4"
                value={selectedFilter}
                onChange={handleFilterChange}
                label="Select Filter"
            >
                <MenuItem value={GearFilterOptions.SHOW_ALL}>Show All</MenuItem>
                <MenuItem value={GearFilterOptions.SHOW_AVAILABLE}>Show Available</MenuItem>
                <MenuItem value={GearFilterOptions.SHOW_OVERDUE}>Show Overdue Only</MenuItem>
                <MenuItem value={GearFilterOptions.HIDE_OVERDUE}>Hide Overdue</MenuItem>
            </Select>
        </FormControl>
    );
}

function AvailibilityView({searchParams}: AvailibilityViewProps) {
    const apiRef = useGridApiContext();

    const visibleRows = gridFilteredSortedRowEntriesSelector(apiRef);

    const [availableCount, checkedOutCount, overdueCount, totalCount] = useMemo(() => {
        let localAvailableCount = 0;
        let localCheckedOutCount = 0;
        let localOverdueCount = 0;
        let localTotalCount = 0;

        visibleRows.map((row) => {
            const gear: GearProps = row.model as GearProps;

            localTotalCount++;

            if (gear.reservationDetails) {
                gear.reservationDetails.due_date < Date.now()
                    ? localOverdueCount++
                    : localCheckedOutCount++;
            } else {
                localAvailableCount++;
            }
        });

        return [localAvailableCount, localCheckedOutCount, localOverdueCount, localTotalCount];
    }, [visibleRows]);

    const filter = searchParams || "All";

    return (
        <div className="flex border-solid border-gray-100 rounded-2xl max-[600px]:flex-wrap justify-center space-x-2">
            <Typography className="px-4 py-2 rounded-2xl border-solid border-gray-300 bg-gray-100">
                {"For "}
                <strong>
                    {`"`}
                    {filter}
                    {`"`}
                </strong>
            </Typography>

            <Typography className="px-4 py-2 border-solid border-gray-300 rounded-2xl bg-green-100">
                <strong>{availableCount}</strong>
                {" Available "}
            </Typography>

            <Typography className="px-4 py-2 border-solid border-gray-300 rounded-2xl bg-amber-50">
                <strong>{checkedOutCount}</strong>
                {" Checked Out "}
            </Typography>

            <Typography className="px-4 py-2 border-solid border-gray-300 rounded-2xl bg-red-100">
                <strong>{overdueCount}</strong>
                {" Overdue "}
            </Typography>

            <Typography className="px-4 py-2 border-solid border-gray-300 rounded-2xl bg-gray-100">
                <strong>{totalCount}</strong>
                {" Total "}
            </Typography>
        </div>
    );
}

type GearToolBarProps = {
    searchParams: string;
    onFilterChange: React.Dispatch<React.SetStateAction<GearFilterOptions>>;
};

export default function GearToolBar({searchParams, onFilterChange}: GearToolBarProps) {
    return (
        <GridToolbarContainer
            sx={{padding: "1rem"}}
            className="bg-gray-200 rounded-2xl rounded-b-none"
        >
            <div className="flex grow space-x-4 justify-evenly">
                <FilterSelect onFilterChange={onFilterChange} />
                <SelectedCount />
            </div>
            <div className="flex grow justify-center">
                <AvailibilityView searchParams={searchParams} />
            </div>
        </GridToolbarContainer>
    );
}
