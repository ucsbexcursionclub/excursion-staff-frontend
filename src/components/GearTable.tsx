import {TablePaginationProps} from "@mui/material";
import MuiPagination from "@mui/material/Pagination";
import {
    DataGrid,
    GridCellParams,
    GridColDef,
    GridComparatorFn,
    GridFilterInputValue,
    GridFilterItem,
    GridFilterModel,
    GridPagination,
    gridPageCountSelector,
    useGridApiContext,
    useGridSelector
} from "@mui/x-data-grid";
import React, {useState} from "react";
import {GearProps} from "src/utils/types";
import GearDetailsDialog from "./GearDetailsDialog";
import {useGear} from "src/providers/GearProvider";
import CustomToolbar from "./GearToolbar";

const dateOperators = [
    {
        value: "<",
        getApplyFilterFn: (filterItem: GridFilterItem) => {
            if (!filterItem.value) {
                return;
            }
            return (params: GridCellParams<GearProps>) => {
                const filterValue = filterItem.value;
                const cellValue = params.row?.reservationDetails?.due_date || Infinity;
                return cellValue < filterValue;
            };
        },
        InputComponent: GridFilterInputValue,
        InputComponentProps: {type: "date"}
    },
    {
        value: ">",
        getApplyFilterFn: (filterItem: GridFilterItem) => {
            if (!filterItem.value) {
                return;
            }
            return (params: GridCellParams<GearProps>) => {
                const filterValue = filterItem.value;
                const cellValue = params.row?.reservationDetails?.due_date || -Infinity;
                return cellValue > filterValue;
            };
        },
        InputComponent: GridFilterInputValue,
        InputComponentProps: {type: "date"}
    }
];

const dateComparator: GridComparatorFn<number> = (v1, v2) => (v1 || Infinity) - (v2 || Infinity);

const columns: GridColDef<GearProps, any, any>[] = [
    {field: "_id", headerName: "ID"},
    {field: "rfid", headerName: "RFID", width: 150},
    {field: "gear_name", headerName: "Gear Name", width: 150},
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
        filterOperators: dateOperators
    },
    {
        field: "date_last_contacted",
        headerName: "Last Contacted",
        type: "date",
        width: 150,
        valueGetter: (params) => params.row.reservationDetails?.last_contacted,
        valueFormatter: (params) => {
            if (params.value) {
                const date = new Date(params.value as number);
                return date.toLocaleDateString();
            }
            return "";
        }
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
};

export default function GearTable({searchParams}: GearTableProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedGear, setSelectedGear] = useState<GearProps | null>(null);
    //const [filterButtonEl, setFilterButtonEl] = React.useState<HTMLButtonElement | null>(null);

    const {gearData, gearRowSelectionModel, setGearRowSelectionModel} = useGear();
    const [selectedFilter, setSelectedFilter] = useState<"showOverdue" | "showAll" | "hideOverdue">(
        "showAll"
    );

    const handleCellClick = (params: any) => {
        if (params.field === "gear_name") {
            setSelectedGear(params.row);
            setDialogOpen(true);
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedGear(null); // Reset the selected gear
    };

    const filterModel: GridFilterModel = React.useMemo(
        () => {
            const items = [];

            switch (selectedFilter) {
                case "showOverdue":
                    items.push({
                        id: 1,
                        field: "due_date",
                        operator: "<",
                        value: Date.now()
                    });
                    break;
                case "hideOverdue":
                    items.push({id: 1, field: "due_date", operator: ">", value: Date.now()});
                    break;
                default:
                    break;
            }

            return {
                items: items,
                quickFilterValues: [searchParams]
            };
        },
        [searchParams, selectedFilter] // Add showOverdue as a dependency
    );
    function getRowId(row: GearProps) {
        return row._id;
    }

    return (
        <div className="w-full h-full bg-gray-300 rounded-xl p-4">
            <DataGrid
                rows={gearData}
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
                filterModel={filterModel}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            _id: false
                        }
                    },
                    sorting: {
                        sortModel: [{field: "due_date", sort: "asc"}]
                    },
                    pagination: {
                        paginationModel: {page: 0, pageSize: 25}
                    }
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                checkboxSelection
                slots={{
                    toolbar: CustomToolbar,
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
