import React, {useState, useMemo} from "react";
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
import {MemberProps} from "../utils/types";
import {useMembers} from "../providers/MembersProvider";
import MemberDetailsDialog from "./MemberDetailsDialog";
import {capitalizeFirstLetter} from "../utils/utils";
import MembersToolBar from "./MembersToolbar";
import {TablePaginationProps} from "@mui/material";
import MuiPagination from "@mui/material/Pagination";
import {MemberFilterOptions} from "../utils/constants";
import {useReservations} from "../providers/ReservationProvider";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import FlagIcon from "@mui/icons-material/Flag";
import {Link as RouterLink} from "react-router-dom";

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
    retrieveMemberById: (memberId: string) => MemberProps | null,
    doesMemberIdHaveOverdueReservation: (id: string) => boolean
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

                    // check if the member has any overdue reservations
                    const hasOverdueGear = doesMemberIdHaveOverdueReservation(params);
                    return hasOverdueGear;
                };
            },
            InputComponent: GridFilterInputValue,
            InputComponentProps: {type: "date"}
        },
        {
            value: MemberFilterOptions.SHOW_FLAGGED,
            getApplyFilterFn: () => null,
            getApplyFilterFnV7: () => {
                return (params: string | null) => {
                    if (!params) return false;
                    const member = retrieveMemberById(params);
                    if (!member) return false;
                    return !!member.flagged;
                };
            },
            InputComponent: GridFilterInputValue,
            InputComponentProps: {type: "text"}
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
    retrieveMemberById: (memberId: string) => MemberProps | null,
    doesMemberIdHaveOverdueReservation: (id: string) => boolean,
    onToggleFlag: (member: MemberProps) => void
) => {
    const columns: GridColDef[] = [
        {
            field: "_id",
            headerName: "ID",
            width: 90,
            filterOperators: getIdOperators(retrieveMemberById, doesMemberIdHaveOverdueReservation)
        },

        {
            field: "name",
            headerName: "Name",
            width: 150,
            renderCell: (params) => {
                const member = params.row as MemberProps;
                const label = member.name ? capitalizeFirstLetter(member.name) : "N/A";
                return (
                    <RouterLink
                        to={`/members/${member._id}`}
                        onClick={(event) => event.stopPropagation()}
                        className="text-blue-700 underline"
                    >
                        {label}
                    </RouterLink>
                );
            }
        },
        {
            field: "flagged",
            width: 80,
            sortable: false,
            align: "center",
            headerName: "Flag",
            renderCell: (params) => {
                const member = params.row as MemberProps;
                const isFlagged = !!member.flagged;
                return (
                    <IconButton
                        color={isFlagged ? "error" : "default"}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFlag(member);
                        }}
                        title={isFlagged ? "Unflag member" : "Flag member"}
                    >
                        <FlagIcon />
                    </IconButton>
                );
            }
        },
        {
            field: "edit",
            width: 51,
            sortable: false,
            align: "center",
            headerName: "Edit",
            renderCell: () => (
                <div className="opacity-25">
                    <IconButton color="inherit">
                        <EditIcon />
                    </IconButton>
                </div>
            )
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
                return "Never Expires";
            },
            sortComparator: dateComparator,
            filterOperators: dateOperators
        },
        {
            field: "signed_up_by",
            headerName: "Signed Up By",
            getApplyQuickFilterFn: undefined,
            width: 140,
            valueFormatter: (params) => {
                const name = retrieveMemberById(params.value)?.name;
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
        },
        {
            field: "is_new_member",
            headerName: "New?",
            width: 75,
            type: "boolean"
        },
        {
            field: "membership_duration",
            headerName: "Duration",
            width: 100,
            valueFormatter: (params) => {
                if (params.value) {
                    if (params.value === 90) {
                        return "3 Months";
                    } else if (params.value === 180) {
                        return "6 Months";
                    } else if (params.value === 365) {
                        return "1 Year";
                    }
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
    const {
        membersData,
        memberRowSelectionModel,
        setMemberRowSelectionModel,
        retrieveMemberById,
        handleMemberUpdate
    } = useMembers();
    const {doesMemberIdHaveOverdueReservation} = useReservations();
    const [selectedFilter, setSelectedFilter] = useState<MemberFilterOptions>(
        MemberFilterOptions.SHOW_ALL
    );
    const [flaggedOnly, setFlaggedOnly] = useState<boolean>(false);

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

            // Flagged-only combination is handled via the 'flaggedOnly' toggle, not as a standalone select option

            case MemberFilterOptions.SHOW_FLAGGED:
                return [
                    {
                        id: 1,
                        field: "_id",
                        operator: MemberFilterOptions.SHOW_FLAGGED,
                        value: today
                    }
                ];

            case MemberFilterOptions.SHOW_ALL:
            default:
                return []; // No filters
        }
    };

    const baseFilterItems = calculateFilterItems();
    const filterItems = useMemo(() => {
        if (!flaggedOnly) return baseFilterItems;
        // add flagged operator on _id to existing filter set
        return [
            {
                id: 0,
                field: "_id",
                operator: MemberFilterOptions.SHOW_FLAGGED,
                value: Date.now()
            },
            ...baseFilterItems
        ];
    }, [baseFilterItems, flaggedOnly]);
    const quickFilterValues = useMemo(
        () => (searchParams.trim() ? [searchParams.trim()] : []),
        [searchParams]
    );

    const handleCellClick = (params: any) => {
        if (params.field === "edit") {
            setSelectedMember(params.row);
            setDialogOpen(true);
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedMember(null);
    };

    const onToggleFlag = useMemo(
        () => (member: MemberProps) => {
            void handleMemberUpdate({...member, flagged: !member.flagged});
        },
        [handleMemberUpdate]
    );

    const columns = useMemo(
        () => getColumns(retrieveMemberById, doesMemberIdHaveOverdueReservation, onToggleFlag),
        [retrieveMemberById, doesMemberIdHaveOverdueReservation, onToggleFlag]
    );

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border border-gray-200">
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
                    quickFilterValues
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
                        onFilterChange: setSelectedFilter,
                        flaggedOnly,
                        setFlaggedOnly
                    }
                }}
                sx={{
                    border: "none",
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#f0fdf4",
                        color: "#166534",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        letterSpacing: "0.02em",
                        textTransform: "uppercase",
                        borderBottom: "2px solid #bbf7d0"
                    },
                    "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
                        outline: "none"
                    },
                    "& .MuiDataGrid-cell": {
                        borderColor: "#f3f4f6",
                        fontSize: "0.875rem",
                        color: "#374151",
                        alignItems: "center",
                        py: 0.75
                    },
                    "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                        outline: "none"
                    },
                    "& .MuiDataGrid-row": {
                        transition: "background-color 0.1s"
                    },
                    "& .MuiDataGrid-row:hover": {
                        backgroundColor: "#f0fdf4"
                    },
                    "& .MuiDataGrid-row.Mui-selected": {
                        backgroundColor: "#dcfce7",
                        "&:hover": {backgroundColor: "#bbf7d0"}
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "1px solid #e5e7eb",
                        backgroundColor: "#fafafa"
                    },
                    "& .MuiCheckbox-root.Mui-checked": {
                        color: "#16a34a"
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
