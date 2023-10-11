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

function Separator() {
    return <div style={{minWidth: "2px", maxWidth: "2px"}} className="bg-black mx-2"></div>;
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
                    (reservation) => reservation.due_date < Date.now()
                ).length > 0
            ) {
                localOverdueCount++;
            }
        });

        return [localActiveCount, localExpiredCount, localOverdueCount, localTotalCount];
    }, [visibleRows, retrieveReservationsByMemberId]);

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
                <strong>{activeCount}</strong>
                {" Active "}
            </Typography>
            <Separator />
            <Typography>
                <strong>{expiredCount}</strong>
                {" Expired "}
            </Typography>
            <Separator />
            <Typography>
                <strong>{overdueCount}</strong>
                {" Have Overdue Gear "}
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
    onFilterChange: React.Dispatch<React.SetStateAction<MemberFilterOptions>>;
};

export default function MembersToolBar({searchParams, onFilterChange}: GearToolBarProps) {
    return (
        <GridToolbarContainer
            sx={{padding: "1rem"}}
            className="bg-gray-200 rounded-2xl rounded-b-none flex flex-row lg:flex-row items-center sm:flex-col sm:space-y-2"
        >
            <div className="flex flex-wrap items-center space-x-2 space-y-2">
                <FilterSelect onFilterChange={onFilterChange} />
                <Separator />
                <SelectedCount />
                <AvailibilityView searchParams={searchParams} />
            </div>
        </GridToolbarContainer>
    );
}
