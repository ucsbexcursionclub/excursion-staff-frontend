import React, {useMemo, useState} from "react";
import {
    Card,
    CardContent,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    Divider,
    Chip
} from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis
} from "recharts";
import {useQuery} from "@tanstack/react-query";
import {useMembers} from "../providers/MembersProvider";
import {useLogin} from "../providers/LoginProvider";
import {useStaff} from "../providers/StaffProvider";
import {getTrips} from "../utils/api";
import {MemberProps, TripType} from "../utils/types";
import {formatEnumLabel, getTripType} from "../utils/utils";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ExploreIcon from "@mui/icons-material/Explore";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

// ─── Pricing ──────────────────────────────────────────────────────────────────

const getMemberPrice = (member: MemberProps): number => {
    const duration = member.membership_duration;
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

// ─── Date helpers ─────────────────────────────────────────────────────────────

const startOfToday = () => { const d = new Date(); d.setHours(0,0,0,0); return d.getTime(); };
const startOfWeek  = () => { const d = new Date(); d.setHours(0,0,0,0); const day = d.getDay(); d.setDate(d.getDate() + ((day===0?-6:1)-day)); return d.getTime(); };
const startOfMonth = () => { const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d.getTime(); };
const startOfYear  = () => { const d = new Date(); d.setMonth(0,1); d.setHours(0,0,0,0); return d.getTime(); };

const fmtCurrency = (n: number) => `$${n.toFixed(2)}`;

function monthKey(ts: number) {
    const d = new Date(ts);
    return d.toLocaleString("default", {month: "short", year: "2-digit"});
}

function lastNMonths(n: number): string[] {
    const out: string[] = [];
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - i);
        out.push(d.toLocaleString("default", {month: "short", year: "2-digit"}));
    }
    return out;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

type KpiCardProps = {
    label: string;
    value: string | number;
    sub?: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
};
function KpiCard({label, value, sub, icon, color, bg}: KpiCardProps) {
    return (
        <div
            className="flex items-center gap-4 rounded-2xl p-4 border"
            style={{backgroundColor: bg, borderColor: `${color}30`}}
        >
            <div
                className="flex items-center justify-center rounded-xl p-3 shrink-0"
                style={{backgroundColor: `${color}20`, color}}
            >
                {icon}
            </div>
            <div>
                <Typography variant="caption" sx={{color: "#6b7280", letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.7rem"}}>
                    {label}
                </Typography>
                <Typography variant="h5" fontWeight={800} sx={{color: "#111827", lineHeight: 1.1}}>
                    {value}
                </Typography>
                {sub && <Typography variant="caption" sx={{color: "#9ca3af"}}>{sub}</Typography>}
            </div>
        </div>
    );
}

const SECTION_HEADER = (title: string, action?: React.ReactNode) => (
    <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <Typography variant="h6" fontWeight={700} sx={{color: "#111827"}}>
            {title}
        </Typography>
        {action}
    </div>
);

// ─── Leaderboard types ────────────────────────────────────────────────────────

type LeaderRow = {staffId: string; name: string; newCount: number; renewCount: number; total: number};

// ─── Main page ────────────────────────────────────────────────────────────────

export default function StatsPage() {
    const {isAdmin} = useLogin();
    const {membersData} = useMembers();
    const {staffData} = useStaff();
    const {data: tripsData, isLoading: isTripsLoading, error: tripsError} = useQuery({
        queryKey: ["trips"],
        queryFn: getTrips
    });

    const [leaderRange, setLeaderRange] = useState<"month" | "year" | "all">("month");
    const [range, setRange]             = useState<"day" | "week" | "month">("day");
    const [chartWindow, setChartWindow] = useState<6 | 12>(12);

    const statsEligible = useMemo(
        () => membersData.filter((m) => !m.exclude_from_stats),
        [membersData]
    );

    // ── Date range for income box ─────────────────────────────────────────────
    const fromTs = useMemo((): number => {
        switch (range) { case "day": return startOfToday(); case "week": return startOfWeek(); case "month": return startOfMonth(); }
    }, [range]);

    const leaderFromTs = useMemo(() => {
        switch (leaderRange) { case "month": return startOfMonth(); case "year": return startOfYear(); case "all": return 0; }
    }, [leaderRange]);

    // ── KPIs ──────────────────────────────────────────────────────────────────
    const activeCount = useMemo(
        () => statsEligible.filter((m) => (m.membership_expiration_date ?? Infinity) > Date.now()).length,
        [statsEligible]
    );
    const tripsThisYear = useMemo(
        () => (tripsData || []).filter((t) => (t.trip_date || 0) >= startOfYear()).length,
        [tripsData]
    );
    const incomeThisMonth = useMemo(
        () => statsEligible.filter((m) => (m.join_datetime ?? 0) >= startOfMonth()).reduce((s, m) => s + getMemberPrice(m), 0),
        [statsEligible]
    );
    const newThisMonth = useMemo(
        () => statsEligible.filter((m) => (m.join_datetime ?? 0) >= startOfMonth()).length,
        [statsEligible]
    );

    // ── Monthly bar chart (signups + revenue) ─────────────────────────────────
    const monthlyData = useMemo(() => {
        const months = lastNMonths(chartWindow);
        const buckets: Record<string, {month: string; new: number; renewals: number; revenue: number}> = {};
        months.forEach((m) => { buckets[m] = {month: m, new: 0, renewals: 0, revenue: 0}; });

        statsEligible.forEach((m) => {
            const k = monthKey(m.join_datetime ?? 0);
            if (!buckets[k]) return;
            const price = getMemberPrice(m);
            if (m.is_new_member) { buckets[k].new += 1; } else { buckets[k].renewals += 1; }
            buckets[k].revenue += price;
        });

        return months.map((m) => buckets[m]);
    }, [statsEligible, chartWindow]);

    // ── Duration pie ─────────────────────────────────────────────────────────
    const durationData = useMemo(() => {
        let d90 = 0, d180 = 0, d365 = 0, other = 0;
        statsEligible.forEach((m) => {
            if (m.membership_duration === 90) d90++;
            else if (m.membership_duration === 180) d180++;
            else if (m.membership_duration === 365) d365++;
            else other++;
        });
        return [
            {name: "3 Months", value: d90,   color: "#fbbf24"},
            {name: "6 Months", value: d180,  color: "#34d399"},
            {name: "1 Year",   value: d365,  color: "#60a5fa"},
            ...(other > 0 ? [{name: "Other", value: other, color: "#a78bfa"}] : [])
        ].filter((d) => d.value > 0);
    }, [statsEligible]);

    // ── Trip type breakdown per month (radar) ─────────────────────────────────
    const tripTypeMonthly = useMemo(() => {
        const months = lastNMonths(6);
        const buckets: Record<string, {month: string; day: number; overnight: number}> = {};
        months.forEach((m) => { buckets[m] = {month: m, day: 0, overnight: 0}; });
        (tripsData || []).forEach((t) => {
            const k = monthKey(t.trip_date || 0);
            if (!buckets[k]) return;
            const type = getTripType(t);
            buckets[k][type] += 1;
        });
        return months.map((m) => buckets[m]);
    }, [tripsData]);

    // ── Leaderboard ───────────────────────────────────────────────────────────
    const leaderboard = useMemo<LeaderRow[]>(() => {
        const byId = new Map<string, LeaderRow>();
        const nameByMemberId = new Map<string, string>(statsEligible.map((m) => [m._id, m.name]));
        for (const m of statsEligible) {
            if ((m.join_datetime ?? 0) < leaderFromTs) continue;
            if (!m.signed_up_by) continue;
            const name = nameByMemberId.get(m.signed_up_by) || "Unknown";
            let row = byId.get(m.signed_up_by);
            if (!row) { row = {staffId: m.signed_up_by, name, newCount: 0, renewCount: 0, total: 0}; byId.set(m.signed_up_by, row); }
            if (m.is_new_member) row.newCount++; else row.renewCount++;
            row.total++;
        }
        return Array.from(byId.values()).sort((a, b) => b.total - a.total).slice(0, 5);
    }, [statsEligible, leaderFromTs]);

    const tripLeaderboards = useMemo(() => {
        const staffNameById = new Map(staffData.map((s) => [s._id, s.memberDetails?.name || s.member_id]));
        const result: Record<TripType, Array<{name: string; total: number}>> = {day: [], overnight: []};
        (["day", "overnight"] as TripType[]).forEach((tripType) => {
            const counts = new Map<string, {name: string; total: number}>();
            (tripsData || []).forEach((trip) => {
                if ((trip.trip_date || 0) < leaderFromTs) return;
                if (getTripType(trip) !== tripType) return;
                (trip.staff_participants || []).forEach((p) => {
                    const name = p.staffDetails?.memberDetails?.name || staffNameById.get(p.staff_id) || p.staff_id;
                    const cur = counts.get(p.staff_id) || {name, total: 0};
                    cur.total++;
                    counts.set(p.staff_id, cur);
                });
            });
            result[tripType] = Array.from(counts.values()).sort((a, b) => b.total - a.total).slice(0, 5);
        });
        return result;
    }, [leaderFromTs, staffData, tripsData]);

    // ── Income summary ────────────────────────────────────────────────────────
    const filtered = useMemo(() => statsEligible.filter((m) => (m.join_datetime ?? 0) >= fromTs), [statsEligible, fromTs]);
    const totals = useMemo(() => {
        let newCount=0, renewCount=0, newSum=0, renewSum=0;
        for (const m of filtered) {
            const price = getMemberPrice(m);
            if (m.is_new_member) { newCount++; newSum += price; } else { renewCount++; renewSum += price; }
        }
        return {total: newSum+renewSum, new: {count: newCount, sum: newSum}, renew: {count: renewCount, sum: renewSum}};
    }, [filtered]);

    const periodLabel = range === "day" ? "Today" : range === "week" ? "This Week" : "This Month";

    // ─────────────────────────────────────────────────────────────────────────

    const periodToggle = (
        value: string,
        onChange: (v: any) => void,
        options: {value: string; label: string}[]
    ) => (
        <ToggleButtonGroup exclusive value={value} onChange={(_, v) => v && onChange(v)} size="small"
            sx={{"& .MuiToggleButton-root": {textTransform: "none", fontSize: "0.78rem", py: 0.5, px: 1.5},
                 "& .Mui-selected": {backgroundColor: "#d9f99d !important", color: "#14532d !important"}}}>
            {options.map((o) => <ToggleButton key={o.value} value={o.value}>{o.label}</ToggleButton>)}
        </ToggleButtonGroup>
    );

    return (
        <div className="max-w-5xl mx-auto w-full">
            {/* Hero */}
            <div className="rounded-2xl px-6 py-6 mb-6"
                style={{background: "linear-gradient(135deg, #fdf4ff 0%, #fce7f3 100%)", border: "1px solid #f0abfc"}}>
                <Typography variant="h4" fontWeight={800} sx={{color: "#701a75", letterSpacing: "-0.5px", mb: 0.5}}>
                    Stats
                </Typography>
                <Typography variant="body2" sx={{color: "#a21caf"}}>
                    Leaderboards, membership trends, and income estimates. Admin-only data is hidden for non-admins.
                </Typography>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <KpiCard label="Active Members"   value={activeCount}             sub="right now"             icon={<PeopleIcon />}       color="#22c55e" bg="#f0fdf4" />
                <KpiCard label="Signups This Month" value={newThisMonth}          sub="new + renewals"        icon={<TrendingUpIcon />}   color="#8b5cf6" bg="#faf5ff" />
                <KpiCard label="Trips This Year"  value={tripsThisYear}           sub="day + overnight"       icon={<ExploreIcon />}      color="#f59e0b" bg="#fffbeb" />
                <KpiCard label="Revenue This Month" value={isAdmin ? fmtCurrency(incomeThisMonth) : "—"} sub="admin only" icon={<AttachMoneyIcon />} color="#ec4899" bg="#fdf2f8" />
            </div>

            {/* ── Monthly signups ───────────────────────────────────────────── */}
            <Card elevation={0} sx={{border: "1px solid #e5e7eb", borderRadius: "16px", mb: 3}}>
                <CardContent sx={{p: 3}}>
                    {SECTION_HEADER(
                        "Monthly Signups",
                        <div className="flex items-center gap-2">
                            {periodToggle(String(chartWindow), setChartWindow as any, [
                                {value: "6", label: "6 mo"},
                                {value: "12", label: "12 mo"}
                            ])}
                        </div>
                    )}
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={monthlyData} margin={{top: 4, right: 8, left: -8, bottom: 0}}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="month" tick={{fontSize: 11, fill: "#6b7280"}} />
                            <YAxis allowDecimals={false} tick={{fontSize: 11, fill: "#6b7280"}} />
                            <Tooltip contentStyle={{borderRadius: 10, fontSize: 13}} />
                            <Legend iconType="circle" wrapperStyle={{fontSize: 12}} />
                            <Bar dataKey="new"      name="New Members" fill="#4ade80" radius={[4,4,0,0]} />
                            <Bar dataKey="renewals" name="Renewals"    fill="#a78bfa" radius={[4,4,0,0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* ── Revenue area + Duration pie (side-by-side on md+) ────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                {/* Revenue over time (admin only) */}
                <Card elevation={0} sx={{border: "1px solid #e5e7eb", borderRadius: "16px"}}>
                    <CardContent sx={{p: 3}}>
                        {SECTION_HEADER("Monthly Revenue")}
                        {isAdmin ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart data={monthlyData} margin={{top: 4, right: 8, left: -8, bottom: 0}}>
                                    <defs>
                                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%"  stopColor="#ec4899" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0.02} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                    <XAxis dataKey="month" tick={{fontSize: 11, fill: "#6b7280"}} />
                                    <YAxis tickFormatter={(v) => `$${v}`} tick={{fontSize: 11, fill: "#6b7280"}} />
                                    <Tooltip formatter={(v: number) => [`$${v}`, "Revenue"]} contentStyle={{borderRadius: 10, fontSize: 13}} />
                                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#ec4899" fill="url(#revGrad)" strokeWidth={2} dot={{r: 3}} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-48">
                                <div className="text-center">
                                    <Typography variant="body2" sx={{color: "#9ca3af", mb: 0.5}}>Admin access required</Typography>
                                    <Chip label="Board only" size="small" sx={{backgroundColor: "#fce7f3", color: "#9d174d"}} />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Membership duration pie */}
                <Card elevation={0} sx={{border: "1px solid #e5e7eb", borderRadius: "16px"}}>
                    <CardContent sx={{p: 3}}>
                        {SECTION_HEADER("Membership Duration Breakdown")}
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={durationData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                                    dataKey="value" nameKey="name" paddingAngle={3} label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`}
                                    labelLine={false}>
                                    {durationData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v: number, name) => [v, name]} contentStyle={{borderRadius: 10, fontSize: 13}} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* ── Trips per month radar ─────────────────────────────────────── */}
            <Card elevation={0} sx={{border: "1px solid #e5e7eb", borderRadius: "16px", mb: 3}}>
                <CardContent sx={{p: 3}}>
                    {SECTION_HEADER("Trips Per Month (Last 6 Months)")}
                    <ResponsiveContainer width="100%" height={220}>
                        <RadarChart data={tripTypeMonthly}>
                            <PolarGrid stroke="#f3f4f6" />
                            <PolarAngleAxis dataKey="month" tick={{fontSize: 12, fill: "#6b7280"}} />
                            <Radar name="Day Trips"       dataKey="day"       stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} />
                            <Radar name="Overnight Trips" dataKey="overnight" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} />
                            <Legend iconType="circle" wrapperStyle={{fontSize: 12}} />
                            <Tooltip contentStyle={{borderRadius: 10, fontSize: 13}} />
                        </RadarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Divider sx={{my: 3}} />

            {/* ── Trip leaders ─────────────────────────────────────────────── */}
            <Card elevation={0} sx={{border: "1px solid #e5e7eb", borderRadius: "16px", mb: 3}}>
                <CardContent sx={{p: 3}}>
                    {SECTION_HEADER("Trip Leaders by Type",
                        periodToggle(leaderRange, setLeaderRange, [
                            {value: "month", label: "This Month"},
                            {value: "year",  label: "This Year"},
                            {value: "all",   label: "All Time"}
                        ])
                    )}
                    {isTripsLoading && <CircularProgress size={24} sx={{color: "#8b5cf6"}} />}
                    {!isTripsLoading && tripsError && <Alert severity="error">{(tripsError as Error).message}</Alert>}
                    {!isTripsLoading && !tripsError && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(["day", "overnight"] as TripType[]).map((tripType) => {
                                const rows = tripLeaderboards[tripType];
                                return (
                                    <div key={tripType}>
                                        <Typography variant="subtitle2" fontWeight={700} sx={{mb: 1, color: tripType === "day" ? "#b45309" : "#6d28d9"}}>
                                            {formatEnumLabel(tripType)} Trips
                                        </Typography>
                                        {rows.length === 0 ? (
                                            <Typography variant="body2" sx={{color: "#9ca3af"}}>No data for this period.</Typography>
                                        ) : (
                                            <ResponsiveContainer width="100%" height={rows.length * 38 + 10}>
                                                <BarChart
                                                    data={rows}
                                                    layout="vertical"
                                                    margin={{top: 0, right: 30, left: 0, bottom: 0}}
                                                >
                                                    <XAxis type="number" allowDecimals={false} tick={{fontSize: 11}} />
                                                    <YAxis type="category" dataKey="name" width={90} tick={{fontSize: 11, fill: "#374151"}} />
                                                    <Tooltip contentStyle={{borderRadius: 10, fontSize: 13}} />
                                                    <Bar dataKey="total" name="Trips" fill={tripType === "day" ? "#fbbf24" : "#a78bfa"} radius={[0,4,4,0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ── Sign-up leaderboard ───────────────────────────────────────── */}
            <Card elevation={0} sx={{border: "1px solid #e5e7eb", borderRadius: "16px", mb: 3}}>
                <CardContent sx={{p: 3}}>
                    {SECTION_HEADER("Staff Sign-up Leaderboard",
                        periodToggle(leaderRange, setLeaderRange, [
                            {value: "month", label: "This Month"},
                            {value: "year",  label: "This Year"},
                            {value: "all",   label: "All Time"}
                        ])
                    )}
                    {leaderboard.length === 0 ? (
                        <Typography variant="body2" sx={{color: "#9ca3af"}}>No data for the selected period.</Typography>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ResponsiveContainer width="100%" height={leaderboard.length * 42 + 10}>
                                <BarChart data={leaderboard} layout="vertical" margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                                    <XAxis type="number" allowDecimals={false} tick={{fontSize: 11}} />
                                    <YAxis type="category" dataKey="name" width={90} tick={{fontSize: 11, fill: "#374151"}} />
                                    <Tooltip contentStyle={{borderRadius: 10, fontSize: 13}} />
                                    <Legend iconType="circle" wrapperStyle={{fontSize: 12}} />
                                    <Bar dataKey="newCount"   name="New"     fill="#4ade80" radius={[0,4,4,0]} stackId="a" />
                                    <Bar dataKey="renewCount" name="Renew"   fill="#a78bfa" radius={[0,4,4,0]} stackId="a" />
                                </BarChart>
                            </ResponsiveContainer>
                            <TableContainer component={Paper} elevation={0} sx={{border: "1px solid #f3f4f6", borderRadius: "12px"}}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{"& th": {fontWeight: 700, backgroundColor: "#faf5ff", color: "#6d28d9", fontSize: "0.75rem"}}}>
                                            <TableCell>#</TableCell>
                                            <TableCell>Staff</TableCell>
                                            <TableCell align="right">New</TableCell>
                                            <TableCell align="right">Renew</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {leaderboard.map((row, idx) => (
                                            <TableRow key={row.staffId} hover>
                                                <TableCell sx={{fontWeight: idx === 0 ? 800 : 400}}>{idx + 1}</TableCell>
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell align="right">{row.newCount}</TableCell>
                                                <TableCell align="right">{row.renewCount}</TableCell>
                                                <TableCell align="right" sx={{fontWeight: 700}}>{row.total}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    )}
                    <Typography variant="caption" sx={{display: "block", mt: 2, color: "#9ca3af"}}>
                        Based on member.join_datetime and signed_up_by. Members excluded from stats are omitted.
                    </Typography>
                </CardContent>
            </Card>

            {/* ── Income summary ───────────────────────────────────────────── */}
            <Card elevation={0} sx={{border: "1px solid #e5e7eb", borderRadius: "16px", mb: 3}}>
                <CardContent sx={{p: 3}}>
                    {SECTION_HEADER("Income Summary",
                        periodToggle(range, setRange, [
                            {value: "day",   label: "Today"},
                            {value: "week",  label: "This Week"},
                            {value: "month", label: "This Month"}
                        ])
                    )}
                    {!isAdmin && (
                        <div className="mb-3 flex items-center gap-2">
                            <Chip label="Board only" size="small" sx={{backgroundColor: "#fce7f3", color: "#9d174d"}} />
                            <Typography variant="body2" sx={{color: "#9ca3af"}}>Exact figures visible to admins only.</Typography>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="rounded-xl p-4 border" style={{backgroundColor: "#f0fdf4", borderColor: "#bbf7d0"}}>
                            <Typography variant="caption" sx={{color: "#15803d", fontWeight: 700, textTransform: "uppercase", fontSize: "0.7rem"}}>New Members</Typography>
                            <Typography variant="h5" fontWeight={800} sx={{color: "#14532d"}}>{isAdmin ? fmtCurrency(totals.new.sum) : "—"}</Typography>
                            <Typography variant="body2" sx={{color: "#22c55e"}}>Count: {isAdmin ? totals.new.count : "—"}</Typography>
                        </div>
                        <div className="rounded-xl p-4 border" style={{backgroundColor: "#fffbeb", borderColor: "#fde68a"}}>
                            <Typography variant="caption" sx={{color: "#b45309", fontWeight: 700, textTransform: "uppercase", fontSize: "0.7rem"}}>Renewals</Typography>
                            <Typography variant="h5" fontWeight={800} sx={{color: "#78350f"}}>{isAdmin ? fmtCurrency(totals.renew.sum) : "—"}</Typography>
                            <Typography variant="body2" sx={{color: "#f59e0b"}}>Count: {isAdmin ? totals.renew.count : "—"}</Typography>
                        </div>
                        <div className="rounded-xl p-4 border" style={{backgroundColor: "#eff6ff", borderColor: "#bfdbfe"}}>
                            <Typography variant="caption" sx={{color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", fontSize: "0.7rem"}}>Total — {periodLabel}</Typography>
                            <Typography variant="h5" fontWeight={800} sx={{color: "#1e3a8a"}}>{isAdmin ? fmtCurrency(totals.total) : "—"}</Typography>
                            <Typography variant="body2" sx={{color: "#3b82f6"}}>Count: {isAdmin ? totals.new.count + totals.renew.count : "—"}</Typography>
                        </div>
                    </div>
                    <Typography variant="caption" sx={{display: "block", mt: 2, color: "#9ca3af"}}>
                        Prices based on membership duration and new/renewal status. Reference only — not an official audit.
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}
