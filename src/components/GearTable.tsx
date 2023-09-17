import * as React from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {GearProps} from "src/utils/types";

const columns: GridColDef[] = [
    {field: "_id", headerName: "ID", width: 90},
    {
        field: "rfid",
        headerName: "RFID",
        width: 100,
        valueFormatter: (params) => (params.value ? params.value.toString() : "N/A")
    },
    {field: "gear_name", headerName: "Gear Name", width: 150},
    {
        field: "is_missing",
        headerName: "Missing",
        type: "boolean",
        width: 100
    },
    {
        field: "is_broken",
        headerName: "Broken",
        type: "boolean",
        width: 100
    },
    {
        field: "description",
        headerName: "Description",
        width: 200,
        valueFormatter: (params) => (params.value ? params.value.toString() : "N/A")
    },
    {
        field: "prev_description",
        headerName: "Previous Description",
        width: 250,
        valueFormatter: (params) => (params.value ? params.value.toString() : "N/A")
    }
];

type GearTableProps = {
    initialData: GearProps[];
};

export default function GearTable({initialData}: GearTableProps) {
    return (
        <div className="w-full h-full bg-gray-300 rounded-xl p-4">
            <DataGrid
                rows={initialData}
                columns={columns}
                getRowId={(row) => row._id}
                initialState={{
                    pagination: {
                        paginationModel: {page: 0, pageSize: 10}
                    }
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                checkboxSelection
            />
        </div>
    );
}
