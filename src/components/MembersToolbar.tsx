import React, {useMemo, useState} from "react";
import {
    GridToolbarContainer,
    gridFilteredSortedRowEntriesSelector,
    useGridApiContext
} from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import {MemberProps} from "../utils/types";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {MemberFilterOptions} from "../utils/constants";
import {useMembers} from "../providers/MembersProvider";
import {useReservations} from "../providers/ReservationProvider";

function SelectedCount() {
    const {memberRowSelectionModel} = useMembers();

    const selectedCount = useMemo(() => memberRowSelectionModel.length, [memberRowSelectionModel]);

    return (
        <div className="px-4 py-2 bg-gray-100 shadow-md rounded-2xl">
            <Typography>
                <strong>{selectedCount}</strong>
                {` Member(s) Selected`}
            </Typography>
        </div>
    );
}

type AvailibilityViewProps = {
    searchParams: string;
};

type FilterSelectProps = {
    onFilterChange: React.Dispatch<React.SetStateAction<MemberFilterOptions>>;
};
function FilterSelect({onFilterChange}: FilterSelectProps) {
    const [selectedFilter, setSelectedFilter] = useState<MemberFilterOptions>(
        MemberFilterOptions.SHOW_ALL
    );

    const handleFilterChange = (event: SelectChangeEvent<MemberFilterOptions>) => {
        setSelectedFilter(event.target.value as MemberFilterOptions);
        onFilterChange(event.target.value as MemberFilterOptions);
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
                <MenuItem value={MemberFilterOptions.SHOW_ALL}>Show All</MenuItem>
                <MenuItem value={MemberFilterOptions.SHOW_EXPIRED}>Expired Members</MenuItem>
                <MenuItem value={MemberFilterOptions.SHOW_ACTIVE}>Active Members</MenuItem>
                <MenuItem value={MemberFilterOptions.SHOW_HAS_OVERDUE_GEAR}>
                    Has Overdue Gear
                </MenuItem>
            </Select>
        </FormControl>
    );
}

function AvailibilityView({searchParams}: AvailibilityViewProps) {
    const apiRef = useGridApiContext();

    const visibleRows = gridFilteredSortedRowEntriesSelector(apiRef);

    const {retrieveReservationsByMemberId} = useReservations();

    const [activeCount, expiredCount, overdueCount, totalCount] = useMemo(() => {
        let localActiveCount = 0;
        let localExpiredCount = 0;
        let localOverdueCount = 0;
        let localTotalCount = 0;

        visibleRows.map((row) => {
            const member: MemberProps = row.model as MemberProps;

            localTotalCount++;

            if ((member.membership_expiration_date || Infinity) > Date.now()) {
                localActiveCount++;
            } else {
                localExpiredCount++;
            }

            if (
                retrieveReservationsByMemberId(member._id).filter(
                    (reservation) =>
                        reservation.due_date < Date.now() && reservation.checked_out_gear.length > 0
                ).length > 0
            ) {
                localOverdueCount++;
            }
        });

        return [localActiveCount, localExpiredCount, localOverdueCount, localTotalCount];
    }, [visibleRows, retrieveReservationsByMemberId]);

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
                <strong>{activeCount}</strong>
                {" Active "}
            </Typography>

            <Typography className="px-4 py-2 border-solid border-gray-300 rounded-2xl bg-amber-50">
                <strong>{expiredCount}</strong>
                {" Expired "}
            </Typography>

            <Typography className="px-4 py-2 border-solid border-gray-300 rounded-2xl bg-red-100">
                <strong>{overdueCount}</strong>
                {" Have Overdue Gear "}
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
    onFilterChange: React.Dispatch<React.SetStateAction<MemberFilterOptions>>;
};

export default function MembersToolBar({searchParams, onFilterChange}: GearToolBarProps) {
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
