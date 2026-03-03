import React, {useMemo, useState} from "react";
import {Alert, Box, Button, CircularProgress, Tab, Tabs, Typography} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {useQuery} from "@tanstack/react-query";
import {getTrips} from "../utils/api";
import {TripProps, TripType} from "../utils/types";
import TripFormDialog from "../components/TripFormDialog";
import TripDetailsDialog from "../components/TripDetailsDialog";
import {formatEnumLabel, getTripType} from "../utils/utils";

const formatDateTime = (timestamp: number) => new Date(timestamp).toLocaleString();

const columns: GridColDef<TripProps>[] = [
    {
        field: "title",
        headerName: "Title",
        flex: 1.4,
        minWidth: 220
    },
    {
        field: "trip_date",
        headerName: "Date",
        flex: 1,
        minWidth: 170,
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
        width: 120,
        valueGetter: (params) => (params.row.member_participants || []).length
    },
    {
        field: "staffCount",
        headerName: "Staff",
        width: 120,
        valueGetter: (params) => (params.row.staff_participants || []).length
    }
];

export default function TripsPage() {
    const [createOpen, setCreateOpen] = useState(false);
    const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
    const [tripTab, setTripTab] = useState<"all" | TripType>("all");

    const {data, isLoading, error} = useQuery({
        queryKey: ["trips"],
        queryFn: getTrips
    });

    const trips = useMemo(
        () =>
            [...(data || [])].sort((a, b) => (b.trip_date || 0) - (a.trip_date || 0)),
        [data]
    );
    const filteredTrips = useMemo(() => {
        if (tripTab === "all") return trips;
        return trips.filter((trip) => getTripType(trip) === tripTab);
    }, [tripTab, trips]);

    return (
        <div className="w-full h-full">
            <Box className="mb-4 flex flex-col gap-4 rounded-xl bg-lime-100 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <Typography variant="h4">Trips</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage trips, participants, and trip comments.
                    </Typography>
                </div>
                <Button variant="contained" onClick={() => setCreateOpen(true)}>
                    Create Trip
                </Button>
            </Box>

            <Box className="mb-4 rounded-xl bg-white px-2">
                <Tabs value={tripTab} onChange={(_event, value) => setTripTab(value)}>
                    <Tab value="all" label={`All Trips (${trips.length})`} />
                    <Tab
                        value="day"
                        label={`Day Trips (${trips.filter((trip) => getTripType(trip) === "day").length})`}
                    />
                    <Tab
                        value="overnight"
                        label={`Overnight Trips (${trips.filter((trip) => getTripType(trip) === "overnight").length})`}
                    />
                </Tabs>
            </Box>

            {isLoading && (
                <Box className="flex justify-center py-12">
                    <CircularProgress />
                </Box>
            )}

            {!isLoading && error && (
                <Alert severity="error">
                    {(error as Error).message || "Failed to load trips."}
                </Alert>
            )}

            {!isLoading && !error && (
                <div className="w-full rounded-xl bg-gray-300 p-4">
                    <DataGrid
                        rows={filteredTrips}
                        columns={columns}
                        getRowId={(row) => row._id}
                        autoHeight
                        pageSizeOptions={[10, 25, 50]}
                        initialState={{
                            sorting: {
                                sortModel: [{field: "trip_date", sort: "desc"}]
                            },
                            pagination: {
                                paginationModel: {page: 0, pageSize: 25}
                            }
                        }}
                        onRowClick={(params) => setSelectedTripId(params.row._id)}
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
