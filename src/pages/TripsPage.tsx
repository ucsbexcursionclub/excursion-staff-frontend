import React, {useMemo, useState} from "react";
import {Alert, Box, Button, CircularProgress, Tab, Tabs, Typography} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {useQuery} from "@tanstack/react-query";
import {getTrips} from "../utils/api";
import {TripProps, TripType} from "../utils/types";
import TripFormDialog from "../components/TripFormDialog";
import TripDetailsDialog from "../components/TripDetailsDialog";
import {formatEnumLabel, getTripType} from "../utils/utils";
import AddIcon from "@mui/icons-material/Add";
import ExploreIcon from "@mui/icons-material/Explore";

const formatDateTime = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });

const columns: GridColDef<TripProps>[] = [
    {field: "title", headerName: "Title", flex: 1.4, minWidth: 220},
    {
        field: "trip_date",
        headerName: "Date",
        flex: 1,
        minWidth: 150,
        valueFormatter: (params) => formatDateTime(params.value as number)
    },
    {
        field: "tripType",
        headerName: "Type",
        width: 140,
        valueGetter: (params) => getTripType(params.row),
        valueFormatter: (params) => `${formatEnumLabel(params.value as TripType)} Trip`
    },
    {
        field: "location",
        headerName: "Location",
        flex: 1,
        minWidth: 160,
        valueGetter: (params) => params.row.location || "N/A"
    },
    {
        field: "memberCount",
        headerName: "Members",
        width: 110,
        valueGetter: (params) => (params.row.member_participants || []).length
    },
    {
        field: "staffCount",
        headerName: "Staff",
        width: 90,
        valueGetter: (params) => (params.row.staff_participants || []).length
    }
];

const PURPLE = "#8b5cf6";

export default function TripsPage() {
    const [createOpen, setCreateOpen] = useState(false);
    const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
    const [tripTab, setTripTab] = useState<"all" | TripType>("all");

    const {data, isLoading, error} = useQuery({
        queryKey: ["trips"],
        queryFn: getTrips
    });

    const trips = useMemo(
        () => [...(data || [])].sort((a, b) => (b.trip_date || 0) - (a.trip_date || 0)),
        [data]
    );

    const filteredTrips = useMemo(() => {
        if (tripTab === "all") return trips;
        return trips.filter((trip) => getTripType(trip) === tripTab);
    }, [tripTab, trips]);

    const dayCount = trips.filter((t) => getTripType(t) === "day").length;
    const overnightCount = trips.filter((t) => getTripType(t) === "overnight").length;

    return (
        <div className="w-full">
            {/* Nav bar — matches Members/Gear style */}
            <Box
                sx={{
                    borderRadius: "12px",
                    mb: 2,
                    background: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 2,
                    justifyContent: "space-between"
                }}
            >
                <div className="flex items-center gap-2">
                    <ExploreIcon sx={{color: PURPLE, fontSize: 28}} />
                    <Typography variant="h5" fontWeight={700} sx={{color: "#3b0764", letterSpacing: "-0.5px"}}>
                        Trips
                    </Typography>
                </div>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateOpen(true)}
                    sx={{
                        backgroundColor: PURPLE,
                        color: "white",
                        "&:hover": {backgroundColor: "#7c3aed"},
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 600,
                        boxShadow: "none"
                    }}
                >
                    Create Trip
                </Button>
            </Box>

            {/* Tab bar */}
            <Box
                sx={{
                    mb: 2,
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "white",
                    px: 1
                }}
            >
                <Tabs
                    value={tripTab}
                    onChange={(_e, v) => setTripTab(v)}
                    TabIndicatorProps={{style: {backgroundColor: PURPLE, height: 3}}}
                    sx={{
                        "& .MuiTab-root": {
                            textTransform: "none",
                            fontWeight: 500,
                            fontSize: "0.9rem",
                            color: "#6b7280"
                        },
                        "& .Mui-selected": {
                            color: `${PURPLE} !important`,
                            fontWeight: 700
                        }
                    }}
                >
                    <Tab value="all" label={`All Trips (${trips.length})`} />
                    <Tab value="day" label={`Day Trips (${dayCount})`} />
                    <Tab value="overnight" label={`Overnight (${overnightCount})`} />
                </Tabs>
            </Box>

            {isLoading && (
                <Box className="flex justify-center py-16">
                    <CircularProgress sx={{color: PURPLE}} />
                </Box>
            )}

            {!isLoading && error && (
                <Alert severity="error">
                    {(error as Error).message || "Failed to load trips."}
                </Alert>
            )}

            {!isLoading && !error && (
                <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                    <DataGrid
                        rows={filteredTrips}
                        columns={columns}
                        getRowId={(row) => row._id}
                        autoHeight
                        pageSizeOptions={[10, 25, 50]}
                        initialState={{
                            sorting: {sortModel: [{field: "trip_date", sort: "desc"}]},
                            pagination: {paginationModel: {page: 0, pageSize: 25}}
                        }}
                        onRowClick={(params) => setSelectedTripId(params.row._id)}
                        sx={{
                            border: "none",
                            cursor: "pointer",
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#f5f3ff",
                                color: "#5b21b6",
                                fontWeight: 700,
                                fontSize: "0.82rem",
                                letterSpacing: "0.02em",
                                textTransform: "uppercase",
                                borderBottom: `2px solid #ddd6fe`
                            },
                            "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
                                outline: "none"
                            },
                            "& .MuiDataGrid-cell": {
                                borderColor: "#f3f4f6",
                                fontSize: "0.875rem",
                                color: "#374151",
                                py: 0.75
                            },
                            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                                outline: "none"
                            },
                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: "#f5f3ff"
                            },
                            "& .MuiDataGrid-row.Mui-selected": {
                                backgroundColor: "#ede9fe",
                                "&:hover": {backgroundColor: "#ddd6fe"}
                            },
                            "& .MuiDataGrid-footerContainer": {
                                borderTop: "1px solid #e5e7eb",
                                backgroundColor: "#fafafa"
                            }
                        }}
                    />
                </div>
            )}

            <TripFormDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSaved={(tripId) => {
                    setCreateOpen(false);
                    setSelectedTripId(tripId);
                }}
            />
            <TripDetailsDialog
                open={!!selectedTripId}
                tripId={selectedTripId}
                onClose={() => setSelectedTripId(null)}
            />
        </div>
    );
}
