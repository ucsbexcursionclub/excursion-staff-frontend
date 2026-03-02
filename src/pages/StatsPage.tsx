import React, {useMemo, useState} from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import {useQuery} from "@tanstack/react-query";
import {useMembers} from "../providers/MembersProvider";
import {useLogin} from "../providers/LoginProvider";
import {useStaff} from "../providers/StaffProvider";
import {getTrips} from "../utils/api";
import {MemberProps, TripType} from "../utils/types";
import {formatEnumLabel, getTripType} from "../utils/utils";

// Pricing logic mirrors the UI copy in HomePage and MemberAddDialog
const getMemberPrice = (member: MemberProps): number => {
    const duration = member.membership_duration; // 90 | 180 | 365
    const isNew = !!member.is_new_member;
    if (isNew) {
        if (duration === 365) return 60;
        if (duration === 180) return 50;
        if (duration === 90) return 30;
    } else {
        if (duration === 365) return 40;
        if (duration === 180) return 30;
        if (duration === 90) return 20;
    }
    return 0;
};

// Helpers to compute date ranges
const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
};

const startOfWeek = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    // Make week start on Monday; adjust if Sunday desired
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1) - day; // Monday as start
    d.setDate(d.getDate() + diff);
    return d.getTime();
};

const startOfMonth = () => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
};

const startOfYear = () => {
    const d = new Date();
    d.setMonth(0, 1); // Jan 1
    d.setHours(0, 0, 0, 0);
    return d.getTime();
};

const fmtCurrency = (n: number) => `$${n.toFixed(2)}`;

type LeaderRow = {
    staffId: string;
    name: string;
    newCount: number;
    renewCount: number;
    total: number;
};

export default function StatsPage() {
    const {isAdmin} = useLogin();
    const {membersData} = useMembers();
    const {staffData} = useStaff();
    const {data: tripsData, isLoading: isTripsLoading, error: tripsError} = useQuery({
        queryKey: ["trips"],
        queryFn: getTrips
    });

    // Leaderboard period
    const [leaderRange, setLeaderRange] = useState<"month" | "year" | "all">("month");

    // Income period (kept from old page)
    const [range, setRange] = useState<"day" | "week" | "month">("day");
    const statsEligibleMembers = useMemo(
        () => membersData.filter((member) => !member.exclude_from_stats),
        [membersData]
    );

    const fromTs = useMemo((): number => {
        switch (range) {
            case "day":
                return startOfToday();
            case "week":
                return startOfWeek();
            case "month":
                return startOfMonth();
        }
    }, [range]);

    // Leaderboard filter window
    const leaderFromTs = useMemo(() => {
        switch (leaderRange) {
            case "month":
                return startOfMonth();
            case "year":
                return startOfYear();
            case "all":
                return 0;
        }
    }, [leaderRange]);

    // Build leaderboard by signed_up_by
    const leaderboard = useMemo<LeaderRow[]>(() => {
        const byId = new Map<string, LeaderRow>();
        // Index memberId -> name for quick lookup
        const nameByMemberId = new Map<string, string>(
            statsEligibleMembers.map((m) => [m._id, m.name])
        );

        for (const m of statsEligibleMembers) {
            const ts = m.join_datetime ?? 0;
            if (ts < leaderFromTs) continue;
            const staffMemberId = m.signed_up_by;
            if (!staffMemberId) continue;

            const name = nameByMemberId.get(staffMemberId) || "Unknown";
            let row = byId.get(staffMemberId);
            if (!row) {
                row = {staffId: staffMemberId, name, newCount: 0, renewCount: 0, total: 0};
                byId.set(staffMemberId, row);
            }
            if (m.is_new_member) row.newCount += 1;
            else row.renewCount += 1;
            row.total += 1;
        }

        return Array.from(byId.values())
            .sort((a, b) => b.total - a.total || b.newCount - a.newCount)
            .slice(0, 3);
    }, [statsEligibleMembers, leaderFromTs]);

    const tripLeaderboards = useMemo(() => {
        const staffNameById = new Map<string, string>();

        staffData.forEach((staff) => {
            staffNameById.set(staff._id, staff.memberDetails?.name || staff.member_id);
        });

        const leaderboards: Record<TripType, Array<{staffId: string; name: string; total: number}>> = {
            day: [],
            overnight: []
        };

        (["day", "overnight"] as TripType[]).forEach((tripType) => {
            const counts = new Map<string, {staffId: string; name: string; total: number}>();

            (tripsData || []).forEach((trip) => {
                if ((trip.trip_date || 0) < leaderFromTs) return;
                if (getTripType(trip) !== tripType) return;

                (trip.staff_participants || []).forEach((participant) => {
                    const existing = counts.get(participant.staff_id) || {
                        staffId: participant.staff_id,
                        name:
                            participant.staffDetails?.memberDetails?.name ||
                            staffNameById.get(participant.staff_id) ||
                            participant.staff_id,
                        total: 0
                    };
                    existing.total += 1;
                    counts.set(participant.staff_id, existing);
                });
            });

            leaderboards[tripType] = Array.from(counts.values())
                .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))
                .slice(0, 5);
        });

        return leaderboards;
    }, [leaderFromTs, staffData, tripsData]);

    const filtered = useMemo(() => {
        return statsEligibleMembers.filter((m) => (m.join_datetime ?? 0) >= fromTs);
    }, [statsEligibleMembers, fromTs]);

    const totals = useMemo(() => {
        let newCount = 0;
        let renewCount = 0;
        let newSum = 0;
        let renewSum = 0;
        for (const m of filtered) {
            const price = getMemberPrice(m);
            if (m.is_new_member) {
                newCount += 1;
                newSum += price;
            } else {
                renewCount += 1;
                renewSum += price;
            }
        }
        return {
            total: newSum + renewSum,
            new: {count: newCount, sum: newSum},
            renew: {count: renewCount, sum: renewSum}
        };
    }, [filtered]);

    return (
        <div className="max-w-5xl mx-auto w-full p-4">
            <Typography variant="h4" className="text-gray-900 font-bold mb-2">
                Stats
            </Typography>
            <Typography variant="body1" className="text-gray-700 mb-4">
                Staff leaderboard and estimated membership income. Contact Xinghan Yang or another webDevStaff for improvements on logistics..
            </Typography>

            <Card className="mb-4">
                <CardContent>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <Typography variant="h6" className="font-bold">
                            Trip Leaders by Type
                        </Typography>
                        <ToggleButtonGroup
                            exclusive
                            value={leaderRange}
                            onChange={(_, v) => v && setLeaderRange(v)}
                            size="small"
                            color="primary"
                        >
                            <ToggleButton value="month">This Month</ToggleButton>
                            <ToggleButton value="year">This Year</ToggleButton>
                            <ToggleButton value="all">All Time</ToggleButton>
                        </ToggleButtonGroup>
                    </div>

                    {isTripsLoading && <CircularProgress className="mt-4" size={24} />}
                    {!isTripsLoading && tripsError && (
                        <Alert severity="error" className="mt-4">
                            {(tripsError as Error).message || "Failed to load trip stats."}
                        </Alert>
                    )}

                    {!isTripsLoading && !tripsError && (
                        <Stack direction={{xs: "column", md: "row"}} spacing={3} className="mt-3">
                            {(["day", "overnight"] as TripType[]).map((tripType) => (
                                <TableContainer key={tripType} component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell colSpan={3}>
                                                    <Typography variant="subtitle1" className="font-bold">
                                                        {formatEnumLabel(tripType)} Trips
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>#</TableCell>
                                                <TableCell>Staff</TableCell>
                                                <TableCell align="right">Trips</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {tripLeaderboards[tripType].length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3}>
                                                        <Typography
                                                            variant="body2"
                                                            className="text-gray-600"
                                                        >
                                                            No {tripType} trip data for the selected period.
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                tripLeaderboards[tripType].map((row, idx) => (
                                                    <TableRow key={`${tripType}-${row.staffId}`} hover>
                                                        <TableCell>{idx + 1}</TableCell>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell align="right">
                                                            {row.total}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ))}
                        </Stack>
                    )}

                    <Typography variant="caption" className="block mt-2 text-gray-600">
                        Trip counts are based on staff participants because trips do not currently
                        store a separate lead field.
                    </Typography>
                </CardContent>
            </Card>

            {/* Leaderboard card */}
            <Card className="mb-4">
                <CardContent>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <Typography variant="h6" className="font-bold">
                            Top 3 Staff by Sign-ups + Renewals
                        </Typography>
                        <ToggleButtonGroup
                            exclusive
                            value={leaderRange}
                            onChange={(_, v) => v && setLeaderRange(v)}
                            size="small"
                            color="primary"
                        >
                            <ToggleButton value="month">This Month</ToggleButton>
                            <ToggleButton value="year">This Year</ToggleButton>
                            <ToggleButton value="all">All Time</ToggleButton>
                        </ToggleButtonGroup>
                    </div>

                    <TableContainer component={Paper} className="mt-3">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Staff</TableCell>
                                    <TableCell align="right">New</TableCell>
                                    <TableCell align="right">Renew</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {leaderboard.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <Typography variant="body2" className="text-gray-600">
                                                No data for the selected period.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    leaderboard.map((row, idx) => (
                                        <TableRow key={row.staffId} hover>
                                            <TableCell>{idx + 1}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell align="right">{row.newCount}</TableCell>
                                            <TableCell align="right">{row.renewCount}</TableCell>
                                            <TableCell align="right">{row.total}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography variant="caption" className="block mt-2 text-gray-600">
                        Counts are based on member.join_datetime and the signed_up_by member ID of the
                        staff. Members marked to be excluded from stats are omitted.
                    </Typography>
                </CardContent>
            </Card>

            {/* Income card (from original Income page) */}
            <Card className="mb-4">
                <CardContent>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <Typography variant="h6" className="font-bold">
                            Income
                        </Typography>
                        <ToggleButtonGroup
                            exclusive
                            value={range}
                            onChange={(_, v) => v && setRange(v)}
                            size="small"
                            color="primary"
                        >
                            <ToggleButton value="day">Today</ToggleButton>
                            <ToggleButton value="week">This Week</ToggleButton>
                            <ToggleButton value="month">This Month</ToggleButton>
                        </ToggleButtonGroup>
                    </div>

                    {!isAdmin && (
                        <Typography variant="h6" className="text-gray-800 font-semibold mt-2">
                            Can not see the exact income? Duh, You are not on board! Contact Board for Audit
                        </Typography>
                    )}
                    <Typography variant="body1" className="text-gray-700 mt-2">
                        Estimated membership income collected in the selected period. Reference only for audit purposes. Contact Xinghan Yang or another webDevStaff for improvements on logistics.
                    </Typography>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div className="bg-green-50 rounded-lg p-3">
                            <Typography variant="subtitle1" className="font-semibold">
                                New Members
                            </Typography>
                            <Typography variant="body2">
                                Count: {isAdmin ? totals.new.count : "—"}
                            </Typography>
                            <Typography variant="body1" className="font-bold">
                                {isAdmin ? fmtCurrency(totals.new.sum) : "—"}
                            </Typography>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-3">
                            <Typography variant="subtitle1" className="font-semibold">
                                Renewals
                            </Typography>
                            <Typography variant="body2">
                                Count: {isAdmin ? totals.renew.count : "—"}
                            </Typography>
                            <Typography variant="body1" className="font-bold">
                                {isAdmin ? fmtCurrency(totals.renew.sum) : "—"}
                            </Typography>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                            <Typography variant="subtitle1" className="font-semibold">
                                Total
                            </Typography>
                            <Typography variant="body2">
                                Count: {isAdmin ? totals.new.count + totals.renew.count : "—"}
                            </Typography>
                            <Typography variant="h6" className="font-bold">
                                {isAdmin ? fmtCurrency(totals.total) : "—"}
                            </Typography>
                        </div>
                    </div>
                    <Typography variant="caption" className="block mt-2 text-gray-600">
                        Uses member.join_datetime to determine period; prices are based on membership duration
                        and whether the record was added as new or renewal. Members marked to be
                        excluded from stats are omitted.
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}
