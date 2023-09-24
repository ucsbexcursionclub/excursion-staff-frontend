import React, {useMemo} from "react";
import {
    GridToolbarContainer,
    GridToolbarFilterButton,
    gridFilteredSortedRowEntriesSelector,
    useGridApiContext
} from "@mui/x-data-grid";
import {useGear} from "src/providers/GearProvider";
import {FormControlLabel, FormGroup, Switch, Typography} from "@mui/material";
import {GearProps} from "src/utils/types";

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

type FilterByOverDueProps = {
    setShowOverdueOnly: React.Dispatch<React.SetStateAction<boolean>>;
};

function FilterByOverDue({setShowOverdueOnly}: FilterByOverDueProps) {
    return (
        <FormGroup sx={{m: 1}} className="pl-4 bg-gray-100 shadow-md rounded-2xl">
            <FormControlLabel
                control={<Switch onClick={() => setShowOverdueOnly((prevVal) => !prevVal)} />}
                label="Show Overdue Only"
            />
        </FormGroup>
    );
}

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
    setShowOverdueOnly: React.Dispatch<React.SetStateAction<boolean>>;
    setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
};

export default function CustomToolbar({
    searchParams,
    setShowOverdueOnly,
    setFilterButtonEl
}: GearToolBarProps) {
    return (
        <GridToolbarContainer
            sx={{padding: "1rem"}}
            className="bg-gray-200 rounded-2xl rounded-b-none"
        >
            <GridToolbarFilterButton
                ref={setFilterButtonEl}
                className="px-4 py-2 bg-gray-100 shadow-md rounded-2xl"
                sx={{color: "black"}}
            />
            <FilterByOverDue setShowOverdueOnly={setShowOverdueOnly} />
            <Separator />
            <SelectedCount />
            <AvailibilityView searchParams={searchParams} />
        </GridToolbarContainer>
    );
}
