import {TablePaginationProps} from "@mui/material";
import MuiPagination from "@mui/material/Pagination";
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
import IconButton from "@mui/material/IconButton";
import React, {useMemo, useState} from "react";
import {GearProps} from "../utils/types";
import GearDetailsDialog from "./GearDetailsDialog";
import {useGear} from "../providers/GearProvider";
import GearToolBar from "./GearToolbar";
import EditIcon from "@mui/icons-material/Edit";
import {GearFilterOptions} from "../utils/constants";
const dateOperators: GridFilterOperator<GearProps, any, any>[] | undefined = [
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
    },
    {
        value: "NULL",
        getApplyFilterFn: () => null,
        getApplyFilterFnV7: () => {
            return (params: number | null) => !params;
        }
    }
];

const dateComparator: GridComparatorFn<number | undefined | null> = (v1, v2) => {
    if (v1 === undefined && v2 === undefined) return 0;
    if (v1 === undefined) return -1;
    if (v2 === undefined) return 1;
    if (v1 === null && v2 === null) return 0;
    if (v1 === null) return -1;
    if (v2 === null) return 1;
    return (v1 as number) - (v2 as number);
};

const columns: GridColDef<GearProps, any, any>[] = [
    {field: "_id", headerName: "ID"},
    {field: "gear_name", headerName: "Gear Name", width: 150},
    {
        field: "description",
        headerName: "Information",
        width: 220,
        valueGetter: (params) => params.row.description || "N/A"
    },
    {
        field: "gear_type",
        headerName: "Type",
        width: 140,
        valueGetter: (params) => (params.row.is_staff_gear ? "Staff Gear" : "Member Rental")
    },
    {
        field: "view",
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
    {
        field: "checked_out_to",
        headerName: "Checked Out To",
        type: "string",
        width: 200,
        valueGetter: (params) => {
            return (
                (params.row.memberDetails?.name ?? "") +
                "\n" +
                (params.row.memberDetails?.email ?? "") +
                "\n" +
                (params.row.memberDetails?.phone_number ?? "")
            );
        }
    },
    {
        field: "due_date",
        headerName: "Due Date",
        type: "date",
        width: 150,
        valueGetter: (params) => params.row.reservationDetails?.due_date,
        valueFormatter: (params) => {
            if (params.value) {
                const date = new Date(params.value);
                return date.toLocaleDateString();
            }
            return "";
        },
        sortComparator: dateComparator,
        filterOperators: dateOperators,
        sortable: true
    },
    {
        field: "date_last_contacted",
        headerName: "Last Contacted",
        type: "date",
        width: 150,
        valueGetter: (params) => params.row.reservationDetails?.last_contacted,
        valueFormatter: (params) => {
            if (params.value) {
                return new Date(params.value).toLocaleDateString();
            }
            return "";
        }
    },
    {
        field: "is_missing",
        headerName: "Missing?",
        width: 100,
        type: "boolean"
    },
    {
        field: "is_broken",
        headerName: "Broken?",
        width: 100,
        type: "boolean"
    }
];

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

type GearTableProps = {
    searchParams: string;
    rows?: GearProps[];
};

export default function GearTable({searchParams, rows}: GearTableProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedGear, setSelectedGear] = useState<GearProps | null>(null);

    const {gearData, gearRowSelectionModel, setGearRowSelectionModel} = useGear();
    const [selectedFilter, setSelectedFilter] = useState<GearFilterOptions>(
        GearFilterOptions.SHOW_ALL
    );

    const handleCellClick = (params: any) => {
        if (params.field === "view") {
            setSelectedGear(params.row);
            setDialogOpen(true);
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedGear(null); // Reset the selected gear
    };

    const getRowId = (row: GearProps) => row._id;
    const calculateFilterItems = () => {
        const today = new Date().getTime();

        switch (selectedFilter) {
            case GearFilterOptions.SHOW_OVERDUE:
                return [
                    {
                        id: 1,
                        field: "due_date",
                        operator: "<",
                        value: today
                    }
                ];

            case GearFilterOptions.HIDE_OVERDUE:
                return [
                    {
                        id: 1,
                        field: "due_date",
                        operator: ">=",
                        value: today
                    }
                ];

            case GearFilterOptions.SHOW_AVAILABLE:
                return [
                    {
                        id: 1,
                        field: "due_date",
                        operator: "NULL",
                        value: today
                    }
                ];

            case GearFilterOptions.SHOW_ALL:
            default:
                return []; // No filters
        }
    };

    const filterItems = calculateFilterItems();
    const quickFilterValues = useMemo(
        () => (searchParams.trim() ? [searchParams.trim()] : []),
        [searchParams]
    );

    return (
        <div className="w-full h-full bg-gray-300 rounded-xl p-4">
            <DataGrid
                rows={rows || gearData}
                getRowHeight={() => "auto"}
                onCellClick={handleCellClick}
                columns={columns}
                getRowId={getRowId}
                disableRowSelectionOnClick
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setGearRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={gearRowSelectionModel}
                disableColumnMenu
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
                        sortModel: [{field: "due_date", sort: "desc"}]
                    },
                    pagination: {
                        paginationModel: {page: 0, pageSize: 25}
                    }
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                checkboxSelection
                slots={{
                    toolbar: GearToolBar,
                    pagination: CustomPagination
                }}
                slotProps={{
                    toolbar: {
                        searchParams: searchParams,
                        onFilterChange: setSelectedFilter
                    }
                }}
            />
            <GearDetailsDialog open={dialogOpen} onClose={handleCloseDialog} gear={selectedGear} />
        </div>
    );
}
