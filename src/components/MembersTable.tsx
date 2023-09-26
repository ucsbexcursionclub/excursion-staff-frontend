import * as React from "react";
import {DataGrid, GridColDef, GridFilterModel} from "@mui/x-data-grid";
import {MemberProps} from "src/utils/types";
import {useMembers} from "src/providers/MembersProvider";
import MemberDetailsDialog from "src/components/MemberDetailsDialog";
import {capitalizeFirstLetter} from "src/utils/utils";

const getColumns = (getMemberById: (memberId) => MemberProps) => {
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
            field: "membership_status",
            headerName: "Status",
            width: 140,
            valueFormatter: (params) => {
                if (params.value) {
                    return capitalizeFirstLetter(params.value);
                }
                return "N/A";
            }
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
        },
        {
            field: "signed_up_by",
            headerName: "Signed Up By",
            width: 140,
            valueFormatter: (params) => {
                if (params.value) {
                    return getMemberById(params.value)?.name;
                }
                return "N/A";
            }
        },
        {
            field: "join_datetime",
            headerName: "Join/Renewal Date",
            type: "date",
            width: 150,
            valueFormatter: (params) => {
                if (params.value) {
                    const date = new Date(params.value as number);
                    const options: Intl.DateTimeFormatOptions = {
                        // Specify the type explicitly
                        timeZone: "America/Los_Angeles", // PST timezone
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    };
                    return date.toLocaleDateString("en-US", options);
                }
                return "N/A";
            }
        }
    ];

    return columns;
};

type MembersTableProps = {
    searchParams: string;
};

export default function MembersTable({searchParams}: MembersTableProps) {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedMember, setSelectedMember] = React.useState<MemberProps | null>(null);
    const {membersData, memberRowSelectionModel, setMemberRowSelectionModel, retrieveMemberItem} =
        useMembers();

    const filterModel: GridFilterModel = React.useMemo(
        () => ({
            items: [],
            quickFilterExcludeHiddenColumns: true,
            quickFilterValues: [searchParams]
        }),
        [searchParams]
    );

    const handleCellClick = (params: any) => {
        if (params.field === "name") {
            setSelectedMember(params.row);
            setDialogOpen(true);
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedMember(null);
    };

    const columns = getColumns(retrieveMemberItem);

    return (
        <div className="w-full h-full bg-gray-300 rounded-xl p-4">
            <DataGrid
                rows={membersData}
                getRowHeight={() => "auto"}
                onCellClick={handleCellClick}
                columns={columns}
                getRowId={(row) => row._id}
                disableRowSelectionOnClick
                filterModel={filterModel}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            _id: false
                        }
                    },
                    sorting: {
                        sortModel: [{field: "join_datetime", sort: "desc"}]
                    },
                    pagination: {
                        paginationModel: {page: 0, pageSize: 25}
                    }
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                checkboxSelection
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setMemberRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={memberRowSelectionModel}
            />
            <MemberDetailsDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                member={selectedMember}
            />
        </div>
    );
}
