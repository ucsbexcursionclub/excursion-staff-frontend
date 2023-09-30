import * as React from "react";
import {DataGrid, GridColDef, GridFilterModel} from "@mui/x-data-grid";
import {capitalizeFirstLetter} from "src/utils/utils";
import {useStaff} from "src/providers/StaffProvider";
import {positionOptions} from "src/utils/constants";

// Get weight for a single position
const getPositionWeight = (position: string): number => {
    const index = positionOptions.indexOf(position);
    return index !== -1 ? positionOptions.length - index : 0; // Return 0 if position not found
};

// Get total weight for a row
const getRowWeight = (positions: string[]): number => {
    if (!positions) return;
    return positions.reduce((total, position) => total + getPositionWeight(position), 0);
};

// Comparator function for MUI DataGrid
const positionsComparator = (v1: string[], v2: string[]): number => {
    const weight1 = getRowWeight(v1);
    const weight2 = getRowWeight(v2);
    if (weight1 < weight2) return -1;
    if (weight1 > weight2) return 1;
    return 0;
};

const columns: GridColDef[] = [
    {field: "_id", headerName: "ID", width: 90},
    {
        field: "name",
        headerName: "Name",
        width: 150,
        valueGetter: (params) => params.row?.memberDetails?.name,
        valueFormatter: (params) => {
            if (params.value) {
                return capitalizeFirstLetter(params.value);
            }
            return "N/A";
        }
    },
    {
        field: "email",
        headerName: "Email",
        width: 200,
        valueGetter: (params) => params.row?.memberDetails?.email
    },
    {
        field: "phone_number",
        headerName: "Phone Number",
        width: 140,
        valueGetter: (params) => params.row?.memberDetails?.phone_number
    },
    {
        field: "positions",
        headerName: "Positions",
        width: 200,
        valueFormatter: (params) => (params.value ? params.value.join(", ") : "N/A"),
        sortComparator: positionsComparator
    }
];

type StaffTableProps = {
    searchParams: string;
};

export default function StaffTable({searchParams}: StaffTableProps) {
    const {staffData, staffRowSelectionModel, setStaffRowSelectionModel} = useStaff();

    const filterModel: GridFilterModel = React.useMemo(
        () => ({
            items: [],
            quickFilterExcludeHiddenColumns: true,
            quickFilterValues: [searchParams]
        }),
        [searchParams]
    );

    return (
        <div className="w-full h-full bg-gray-300 rounded-xl p-4">
            <DataGrid
                rows={staffData}
                getRowHeight={() => "auto"}
                columns={columns}
                disableRowSelectionOnClick
                getRowId={(row) => row._id}
                filterModel={filterModel}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            _id: false
                        }
                    },
                    sorting: {
                        sortModel: [{field: "positions", sort: "desc"}]
                    },
                    pagination: {
                        paginationModel: {page: 0, pageSize: 25}
                    }
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                checkboxSelection
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setStaffRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={staffRowSelectionModel}
            />
        </div>
    );
}
