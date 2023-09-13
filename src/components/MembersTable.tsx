import * as React from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {MemberProps} from "src/utils/types";

const columns: GridColDef[] = [
    {field: "_id", headerName: "ID", width: 90},
    {field: "name", headerName: "Name", width: 150},
    {field: "email", headerName: "Email", width: 200},
    {field: "phone_number", headerName: "Phone Number", width: 140},
    {
        field: "membership_status",
        headerName: "Membership Status",
        width: 150
    },
    {
        field: "is_new_member",
        headerName: "New Member",
        type: "boolean",
        width: 120
    },
    {
        field: "membership_expiration_date",
        headerName: "Expiration Date",
        type: "date",
        width: 150,
        valueFormatter: (params) => {
            if (params.value) {
                const date = new Date(params.value as number);
                return date.toLocaleDateString();
            }
            return "N/A";
        }
    }
];

type MemberTableProps = {
    initialData: MemberProps[];
};

export default function MembersTable({initialData}: MemberTableProps) {
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
