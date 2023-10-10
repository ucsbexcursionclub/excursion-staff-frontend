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

function Separator() {
    return <div style={{minWidth: "2px", maxWidth: "2px"}} className="bg-black mx-2"></div>;
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
        const currentDate = new Date();

        visibleRows.map((row) => {
            const gear: GearProps = row.model as GearProps;

            localTotalCount++;

            if (gear.current_reservation) {
                const dueDate = new Date(gear.reservationDetails?.due_date);
                const timeDifference = currentDate.getTime() - dueDate.getTime();
                const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
                if (daysDifference <= 7) {
                    localCheckedOutCount++;
                }
            } else {
                localAvailableCount++;
            }

            if (gear.reservationDetails && gear.reservationDetails.due_date < Date.now()) {
                localOverdueCount++;
            }
        });

        return [localAvailableCount, localCheckedOutCount, localOverdueCount, localTotalCount];
    }, [visibleRows]);

    const filter = searchParams || "All";

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
            <Separator />
            <Typography>
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
            className="bg-gray-200 rounded-2xl rounded-b-none flex flex-row lg:flex-row items-center"
        >
            <FilterSelect onFilterChange={onFilterChange} />
            <Separator />
            <SelectedCount />
            <AvailibilityView searchParams={searchParams} />
        </GridToolbarContainer>
    );
}
