import React, {useMemo, useState} from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Collapse,
    Divider,
    Stack,
    Typography
} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {ReservationProps} from "../utils/types";
import {useReservations} from "../providers/ReservationProvider";
import {useGear} from "../providers/GearProvider";
import {MILLISECONDS_IN_DAY} from "../utils/constants";
import {getReservationCheckoutTime} from "../utils/utils";

const formatDate = (timestamp: number) => new Date(timestamp).toLocaleDateString();

const formatDays = (start: number, end: number) => {
    const days = Math.max(1, Math.round((end - start) / MILLISECONDS_IN_DAY));
    return `${days} ${days === 1 ? "day" : "days"}`;
};

type ReservationDetailsProps = {
    reservation: ReservationProps;
    gearId: string;
};

function ReservationDetails({reservation, gearId}: ReservationDetailsProps) {
    const [expanded, setExpanded] = useState(false);
    const {retrieveGearItem} = useGear();

    // Every gear item on this reservation, still out first
    const reservationGear = [
        ...reservation.checked_out_gear.map((id) => ({id, isOut: true})),
        ...reservation.checked_in_gear.map((id) => ({id, isOut: false}))
    ];

    const checkedOutAt = getReservationCheckoutTime(reservation);
    const returnedAt = reservation.gear_returned_at?.[gearId];
    const isStillOut = reservation.checked_out_gear.includes(gearId);
    const isOverdue = isStillOut && reservation.due_date < Date.now();

    return (
        <Card sx={{minWidth: 275, marginBottom: "1rem"}}>
            <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                    <Typography variant="h6" component="div">
                        {reservation.memberDetails?.name || "Deleted member"}
                    </Typography>
                    {isStillOut && (
                        <Chip
                            size="small"
                            label={isOverdue ? "Overdue" : "Checked out"}
                            color={isOverdue ? "error" : "success"}
                        />
                    )}
                </Stack>
                <Typography color="text.secondary">
                    <strong>Checked out:</strong> {formatDate(checkedOutAt)}
                </Typography>
                {isStillOut ? (
                    <Typography color="text.secondary">
                        <strong>Duration:</strong> {formatDays(checkedOutAt, Date.now())} so far
                    </Typography>
                ) : returnedAt ? (
                    <>
                        <Typography color="text.secondary">
                            <strong>Returned:</strong> {formatDate(returnedAt)}
                        </Typography>
                        <Typography color="text.secondary">
                            <strong>Duration:</strong> {formatDays(checkedOutAt, returnedAt)}
                        </Typography>
                    </>
                ) : (
                    <Typography color="text.secondary">
                        <strong>Returned:</strong> not recorded
                    </Typography>
                )}

                <Collapse in={expanded} unmountOnExit>
                    <Divider sx={{my: 1.5}} />
                    <Typography color="text.secondary">
                        <strong>Due:</strong> {formatDate(reservation.due_date)}
                    </Typography>
                    <Typography color="text.secondary">
                        <strong>Last contacted:</strong>{" "}
                        {reservation.last_contacted
                            ? formatDate(reservation.last_contacted)
                            : "Never"}
                    </Typography>
                    <Typography color="text.secondary" sx={{mt: 1}}>
                        <strong>Gear on this reservation:</strong>
                    </Typography>
                    {reservationGear.map(({id, isOut}) => (
                        <Typography key={id} color="text.secondary" sx={{pl: 2}}>
                            {retrieveGearItem(id)?.gear_name || "Unknown gear"}
                            {id === gearId ? " (this item)" : ""} — {isOut ? "out" : "returned"}
                        </Typography>
                    ))}
                </Collapse>
            </CardContent>
            <CardActions>
                {reservation.memberDetails ? (
                    <Button
                        size="small"
                        component={RouterLink}
                        to={`/members/${reservation.reserving_member}`}
                    >
                        View Member
                    </Button>
                ) : (
                    <Button size="small" disabled>
                        View Member
                    </Button>
                )}
                <Button size="small" onClick={() => setExpanded((current) => !current)}>
                    {expanded ? "Hide Reservation" : "View Reservation"}
                </Button>
            </CardActions>
        </Card>
    );
}

type CheckoutHistoryProps = {
    gearId: string;
};

export default function CheckoutHistory({gearId}: CheckoutHistoryProps) {
    const {reservationsData} = useReservations();

    // Newest rental first
    const reservations = useMemo(
        () =>
            reservationsData
                .filter((reservation) =>
                    [...reservation.checked_in_gear, ...reservation.checked_out_gear].includes(
                        gearId
                    )
                )
                .sort(
                    (a, b) => getReservationCheckoutTime(b) - getReservationCheckoutTime(a)
                ),
        [gearId, reservationsData]
    );

    return (
        <Stack>
            {reservations.length > 0 ? (
                reservations.map((reservation) => (
                    <ReservationDetails
                        key={reservation._id}
                        reservation={reservation}
                        gearId={gearId}
                    />
                ))
            ) : (
                <Typography>No Reservation History</Typography>
            )}
        </Stack>
    );
}
