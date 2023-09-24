import {TablePaginationProps} from "@mui/material";
import MuiPagination from "@mui/material/Pagination";
import {
    DataGrid,
    GridCellParams,
    GridColDef,
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
                const filterValue = new Date(Number(filterItem.value));
                const cellValue = new Date(params.row?.reservationDetails?.due_date || Infinity);
                return cellValue < filterValue;
            };
        },
        InputComponent: GridFilterInputValue,
        InputComponentProps: {type: "date"}
    }
];

const columns: GridColDef[] = [
    {field: "_id", headerName: "ID"},
    {field: "rfid", headerName: "RFID", width: 150},
    {field: "gear_name", headerName: "Gear Name", width: 150},
    {
        field: "missing",
        headerName: "Missing?",
        width: 100,
        type: "boolean"
    },
    {
        field: "broken",
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
                (params.row?.memberDetails?.name ?? "") +
                "\n" +
                (params.row?.memberDetails?.email ?? "") +
                "\n" +
                (params.row?.memberDetails?.phone_number ?? "")
            );
        }
    },
    {
        field: "due_date",
        headerName: "Due Date",
        type: "date",
        width: 150,
        valueGetter: (params) => params.row?.reservationDetails?.due_date,
        valueFormatter: (params) => {
            if (params.value) {
                const date = new Date(params.value);
                return date.toLocaleDateString();
            }
            return "";
        },
        filterOperators: dateOperators
    },
    {
        field: "date_last_contacted",
        headerName: "Last Contacted",
        type: "date",
        width: 150,
        valueGetter: (params) => params.row?.reservationDetails?.last_contacted,
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
    const [filterButtonEl, setFilterButtonEl] = React.useState<HTMLButtonElement | null>(null);

    const {gearData, gearRowSelectionModel, setGearRowSelectionModel} = useGear();

    const [showOverdueOnly, setShowOverdueOnly] = useState<boolean>(false);

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
            if (showOverdueOnly) {
                // Ensure due_date is a number representing a date timestamp
                items.push({id: 1, field: "due_date", operator: "<", value: Date.now()});
            }
            return {
                items: items,
                quickFilterExcludeHiddenColumns: true,
                quickFilterValues: [searchParams]
            };
        },
        [searchParams, showOverdueOnly] // Add showOverdue as a dependency
    );

    return (
        <div className="w-full h-full bg-gray-300 rounded-xl p-4">
            <DataGrid
                rows={gearData}
                getRowHeight={() => "auto"}
                onCellClick={handleCellClick}
                columns={columns}
                getRowId={(row) => row._id}
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
                    panel: {
                        anchorEl: filterButtonEl
                    },
                    toolbar: {
                        searchParams: searchParams,
                        setShowOverdueOnly: setShowOverdueOnly,
                        setFilterButtonEl: setFilterButtonEl
                    }
                }}
            />
            <GearDetailsDialog open={dialogOpen} onClose={handleCloseDialog} gear={selectedGear} />
        </div>
    );
}
