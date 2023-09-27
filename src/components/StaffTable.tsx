import * as React from "react";
import {DataGrid, GridColDef, GridFilterModel} from "@mui/x-data-grid";
import {capitalizeFirstLetter} from "src/utils/utils";
import {StaffMemberProps} from "src/utils/types";

const getColumns = () => {
    const columns: GridColDef[] = [
        {field: "_id", headerName: "ID", width: 90},
        {
            field: "name",
            headerName: "Name",
            width: 150,
            valueFormatter: (params) => {
                if (params.value) {
                    return capitalizeFirstLetter(params.value);
                }
                return "N/A";
            }
        },
        {field: "email", headerName: "Email", width: 200},
        {field: "phone_number", headerName: "Phone Number", width: 140},
        {
            field: "staff_details.positions",
            headerName: "Positions",
            width: 200,
            valueFormatter: (params) => {
                if (params.value && Array.isArray(params.value)) {
                    return params.value.join(", ");
                }
                return "Fix: Not showing positions";
            }
        }
    ];

    return columns;
};

type StaffTableProps = {
    searchParams: string;
};

export default function StaffTable({searchParams}: StaffTableProps) {
    // const [selectedMember, setSelectedMember] = React.useState<StaffMemberProps | null>(null);
    // const {staffRowSelectionModel, setStaffRowSelectionModel} = useStaff();

    // Sample fake data for testing
    const initialStaffData: StaffMemberProps[] = [
        {
            _id: "1",
            name: "John Doe",
            email: "john@example.com",
            phone_number: "123-456-7890",
            staff_details: {
                _id: "2",
                member_id: "1",
                profileImageUrl: "4",
                bio: "beep boop",
                positions: ["Director"]
            }
        },
        {
            _id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            phone_number: "987-654-3210",
            staff_details: {
                _id: "2",
                member_id: "1",
                profileImageUrl: "4",
                bio: "beep boop",
                positions: ["Web Developer", "General Staff"]
            }
        },
        {
            _id: "3",
            name: "Jane Smith 2",
            email: "jane@example.com",
            phone_number: "987-654-3210",
            staff_details: {
                _id: "2",
                member_id: "1",
                profileImageUrl: "4",
                bio: "beep boop",
                positions: ["General Staff"]
            }
        }
        // Add more sample data as needed
    ];

    const filterModel: GridFilterModel = React.useMemo(
        () => ({
            items: [],
            quickFilterExcludeHiddenColumns: true,
            quickFilterValues: [searchParams]
        }),
        [searchParams]
    );

    const columns = getColumns();

    return (
        <div className="w-full h-full bg-gray-300 rounded-xl p-4">
            <DataGrid
                rows={initialStaffData}
                getRowHeight={() => "auto"}
                columns={columns}
                getRowId={(row) => row._id}
                // disableRowSelectionOnClick
                filterModel={filterModel}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            _id: false
                        }
                    },
                    sorting: {
                        sortModel: [{field: "name", sort: "asc"}]
                    },
                    pagination: {
                        paginationModel: {page: 0, pageSize: 25}
                    }
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                checkboxSelection
                // onRowSelectionModelChange={(newRowSelectionModel) => {
                //     setStaffRowSelectionModel(newRowSelectionModel);
                // }}
                // rowSelectionModel={staffRowSelectionModel}
            />
            {/* <StaffDetailsDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          member={selectedMember}
      /> */}
        </div>
    );
}
