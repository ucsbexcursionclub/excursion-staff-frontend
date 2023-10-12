import React, {useState} from "react";
import {
    DataGrid,
    GridColDef,
    GridComparatorFn,
    GridFilterInputValue,
    GridFilterItem,
    GridFilterOperator,
    GridPagination,
    gridPageCountSelector,
    useGridApiContext,
    useGridSelector
} from "@mui/x-data-grid";
import {MemberProps, ReservationProps} from "../utils/types";
import {useMembers} from "../providers/MembersProvider";
import MemberDetailsDialog from "./MemberDetailsDialog";
import {capitalizeFirstLetter} from "../utils/utils";
import MembersToolBar from "./MembersToolbar";
import {TablePaginationProps} from "@mui/material";
import MuiPagination from "@mui/material/Pagination";
import {MemberFilterOptions} from "../utils/constants";
import {useReservations} from "../providers/ReservationProvider";

function Pagination({
    page,
    onPageChange,
    className
}: Pick<TablePaginationProps, "page" | "onPageChange" | "className">) {
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <MuiPagination
            color="primary"
            className={className}
            count={pageCount}
            page={page + 1}
            onChange={(event, newPage) => {
                onPageChange(event as any, newPage - 1);
            }}
        />
    );
}

function CustomPagination(props: any) {
    return <GridPagination ActionsComponent={Pagination} {...props} />;
}

const dateOperators: GridFilterOperator<MemberProps, any, any>[] | undefined = [
    {
        value: "<",
        getApplyFilterFn: () => null,
        getApplyFilterFnV7: (filterItem: GridFilterItem) => {
            return (params: number | null) => {
                if (!params) {
                    return false;
                }

                const filterValue = filterItem.value;
                const cellValue = params;
                return cellValue < filterValue;
            };
        },
        InputComponent: GridFilterInputValue,
        InputComponentProps: {type: "date"}
    },
    {
        value: ">=",
        getApplyFilterFn: () => null,
        getApplyFilterFnV7: (filterItem: GridFilterItem) => {
            return (params: number | null) => {
                const filterValue = filterItem.value;
                const cellValue = params || Infinity;
                return cellValue >= filterValue;
            };
        },
        InputComponent: GridFilterInputValue,
        InputComponentProps: {type: "date"}
    }
];

const getIdOperators = (
    retrieveReservationsByMemberId: (id: string) => ReservationProps[] | null
): GridFilterOperator<MemberProps, any, any>[] | undefined => {
    const idOperators: GridFilterOperator<MemberProps, any, any>[] = [
        {
            value: MemberFilterOptions.SHOW_HAS_OVERDUE_GEAR,
            getApplyFilterFn: () => null,
            getApplyFilterFnV7: () => {
                return (params: string | null) => {
                    if (!params) {
                        return false;
                    }

                    const memberId = params;

                    return (
                        (retrieveReservationsByMemberId(memberId) ?? []).filter(
                            (reservation) => reservation.due_date < Date.now()
                        ).length > 0
                    );
                };
            },
            InputComponent: GridFilterInputValue,
            InputComponentProps: {type: "date"}
        },
        {
            value: ">=",
            getApplyFilterFn: () => null,
            getApplyFilterFnV7: (filterItem: GridFilterItem) => {
                return (params: number | null) => {
                    const filterValue = filterItem.value;
                    const cellValue = params || Infinity;
                    return cellValue >= filterValue;
                };
            },
            InputComponent: GridFilterInputValue,
            InputComponentProps: {type: "date"}
        }
    ];

    return idOperators;
};

const dateComparator: GridComparatorFn<number> = (v1, v2) => (v1 || Infinity) - (v2 || Infinity);

const getColumns = (
    getMemberById: (memberId: string) => MemberProps | null,
    retrieveReservationsByMemberId: (id: string) => ReservationProps[] | null
) => {
    const columns: GridColDef[] = [
        {
            field: "_id",
            headerName: "ID",
            width: 90,
            filterOperators: getIdOperators(retrieveReservationsByMemberId)
        },
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
            field: "membership_expiration_date",
            headerName: "Expiration Date",
            type: "date",
            width: 150,
            valueFormatter: (params) => {
                if (params.value) {
                    const date = new Date(params.value as number);
                    const options: Intl.DateTimeFormatOptions = {
                        timeZone: "America/Los_Angeles",
                        timeZoneName: "short"
                    };
                    return date.toLocaleDateString("en-US", options);
                }
                return "N/A";
            },
            sortComparator: dateComparator,
            filterOperators: dateOperators
        },
        {
            field: "signed_up_by",
            headerName: "Signed Up By",
            width: 140,
            valueFormatter: (params) => {
                const name = getMemberById(params.value)?.name;
                if (name) {
                    return capitalizeFirstLetter(name);
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
    const {membersData, memberRowSelectionModel, setMemberRowSelectionModel, retrieveMemberById} =
        useMembers();
    const {retrieveReservationsByMemberId} = useReservations();
    const [selectedFilter, setSelectedFilter] = useState<MemberFilterOptions>(
        MemberFilterOptions.SHOW_ALL
    );

    const getRowId = (row: MemberProps) => row._id;
    const calculateFilterItems = () => {
        const today = new Date().getTime();

        switch (selectedFilter) {
            case MemberFilterOptions.SHOW_ACTIVE:
                return [
                    {
                        id: 1,
                        field: "membership_expiration_date",
                        operator: ">=",
                        value: today
                    }
                ];

            case MemberFilterOptions.SHOW_EXPIRED:
                return [
                    {
                        id: 1,
                        field: "membership_expiration_date",
                        operator: "<",
                        value: today
                    }
                ];

            case MemberFilterOptions.SHOW_HAS_OVERDUE_GEAR:
                return [
                    {
                        id: 1,
                        field: "_id",
                        operator: MemberFilterOptions.SHOW_HAS_OVERDUE_GEAR,
                        value: today
                    }
                ];

            case MemberFilterOptions.SHOW_ALL:
            default:
                return []; // No filters
        }
    };

    const filterItems = calculateFilterItems();

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

    const columns = getColumns(retrieveMemberById, retrieveReservationsByMemberId);

    return (
        <div className="w-full h-full bg-gray-300 rounded-xl p-4">
            <DataGrid
                rows={membersData}
                getRowHeight={() => "auto"}
                onCellClick={handleCellClick}
                columns={columns}
                getRowId={getRowId}
                disableRowSelectionOnClick
                filterModel={{
                    items: filterItems,
                    quickFilterExcludeHiddenColumns: true,
                    quickFilterValues: [searchParams]
                }}
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
                slots={{
                    toolbar: MembersToolBar,
                    pagination: CustomPagination
                }}
                slotProps={{
                    toolbar: {
                        searchParams: searchParams,
                        onFilterChange: setSelectedFilter
                    }
                }}
            />
            <MemberDetailsDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                member={selectedMember}
            />
        </div>
    );
}
