import React, {useEffect, useState} from "react";
import {Button, Card, CardActions, CardContent, Stack, Typography} from "@mui/material";
import {ReservationProps} from "../utils/types";
import {useReservations} from "../providers/ReservationProvider";

type ReservationDetailsProps = {
    reservation: ReservationProps;
};

function ReservationDetails({reservation}: ReservationDetailsProps) {
    return (
        <Card sx={{minWidth: 275, marginBottom: "1rem"}}>
            <CardContent>
                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                    Reservation
                </Typography>
                <Typography variant="h5" component="div" sx={{mb: 1}}>
                    {reservation.memberDetails?.name}
                </Typography>
                <Typography color="text.secondary">
                    <strong>Email:</strong> {reservation.memberDetails?.email}
                </Typography>
                <Typography color="text.secondary">
                    <strong>Phone Number:</strong> {reservation.memberDetails?.phone_number}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">View Member</Button>
                <Button size="small">View Reservation</Button>
            </CardActions>
        </Card>
    );
}

type CheckoutHistoryProps = {
    gearId: string;
};

export default function CheckoutHistory({gearId}: CheckoutHistoryProps) {
    const [reservations, setReservations] = useState<ReservationProps[]>([]);

    const {retrieveReservationsByGearId} = useReservations();

    useEffect(() => {
        const retrievedReservations = retrieveReservationsByGearId(gearId).reverse();

        setReservations(retrievedReservations);
    }, [gearId, retrieveReservationsByGearId]);

    return (
        <Stack>
            {reservations.length > 0 ? (
                reservations.map((reservation) => (
                    <ReservationDetails key={reservation._id} reservation={reservation} />
                ))
            ) : (
                <Typography>No Reservation History</Typography>
            )}
        </Stack>
    );
}
