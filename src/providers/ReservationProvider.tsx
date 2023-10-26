import {GridRowSelectionModel} from "@mui/x-data-grid";
import React, {createContext, useContext, useEffect, useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import {addReservation, endReservations, getReservations} from "../utils/api";
import {GearProps, MemberProps, NewReservationProps, ReservationProps} from "../utils/types";
import {useLogin} from "./LoginProvider";

interface ReservationsContextProps {
    reservationsData: ReservationProps[];
    setReservationsData: React.Dispatch<React.SetStateAction<ReservationProps[]>>;
    handleReservationAdd: (selectedMember: MemberProps, selectedGear: GearProps[]) => Promise<void>;
    refetchReservations: (reservationIds: string[]) => Promise<void>;
    reservationRowSelectionModel: GridRowSelectionModel;
    retrieveReservation: (id: string) => ReservationProps;
    retrieveReservations: (ids: string[]) => ReservationProps[];
    setReservationRowSelectionModel: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>;
    retrieveReservationsByGearId: (id: string) => ReservationProps[];
    retrieveOpenReservationsByGearId: (id: string) => ReservationProps[];
    retrieveReservationsByMemberId: (id: string) => ReservationProps[];
    retrieveOpenReservationsByMemberId: (id: string) => ReservationProps[];
}

const useReservationsState = () => {
    const queryClient = useQueryClient();
    const [reservationsData, setReservationsData] = useState<ReservationProps[]>([]);
    const {isStaff} = useLogin();

    const {data: fetchReservationsData} = useQuery("reservations", getReservations, {
        enabled: isStaff
    });

    useEffect(() => {
        if (fetchReservationsData) {
            setReservationsData(fetchReservationsData);
            fetchReservationsData.forEach(async (reservationItem) => {
                queryClient.setQueryData(["reservationItem", reservationItem._id], reservationItem);
                await queryClient.prefetchQuery(["reservationItem", reservationItem._id], {
                    initialData: reservationItem,
                    staleTime: Infinity
                });
            });
        }
    }, [fetchReservationsData, queryClient]);

    return {reservationsData, setReservationsData};
};

const useReservationsOperations = (
    reservationsData: ReservationProps[],
    setReservationsData: React.Dispatch<React.SetStateAction<ReservationProps[]>>
) => {
    const queryClient = useQueryClient();

    const recomputeAggregatedReservations = () => {
        const aggregatedReservations = queryClient
            .getQueriesData<ReservationProps>({
                queryKey: ["reservationItem"],
                exact: false
            })
            .map((query) => query[1]);

        setReservationsData(aggregatedReservations);
    };

    const retrieveReservation = (id: string) => {
        return reservationsData.filter((reservation) => reservation._id === id)[0];
    };

    const retrieveReservations = (ids: string[]) => {
        return reservationsData.filter((reservation) => ids.includes(reservation._id));
    };

    const retrieveReservationsByGearId = (id: string) => {
        return reservationsData.filter((reservation) =>
            [...reservation.checked_in_gear, reservation.checked_out_gear].includes(id)
        );
    };

    const retrieveReservationsByMemberId = (id: string) => {
        return reservationsData.filter((reservation) => reservation.reserving_member === id);
    };

    const retrieveOpenReservationsByMemberId = (id: string) => {
        return reservationsData.filter(
            (reservation) =>
                reservation.reserving_member === id && reservation.checked_out_gear.length > 0
        );
    };

    const retrieveOpenReservationsByGearId = (id: string) => {
        return reservationsData.filter((reservation) => reservation.checked_out_gear.includes(id));
    };

    const handleReservationAdd = async (selectedMember: MemberProps, selectedGear: GearProps[]) => {
        const newReservationData: NewReservationProps = {
            checked_out_gear: selectedGear.map((gear) => gear._id),
            reserving_member: selectedMember._id
        };

        const addedReservation = await addReservation(newReservationData);

        queryClient.setQueryData(["reservationItem", addedReservation._id], addedReservation);
        await queryClient.prefetchQuery(["reservationItem", addedReservation._id], {
            initialData: addedReservation,
            staleTime: Infinity
        });

        await refetchReservations(
            selectedGear.map((gear) => gear.current_reservation).filter(Boolean) as string[]
        );

        recomputeAggregatedReservations();
    };

    const refetchReservations = async (reservationIds: string[]) => {
        await Promise.all(
            reservationIds.map(async (reservationId) => {
                return await queryClient.refetchQueries({
                    queryKey: ["reservationItem", reservationId]
                });
            })
        );

        recomputeAggregatedReservations();
    };

    return {
        handleReservationAdd,
        refetchReservations,
        retrieveReservation,
        retrieveReservations,
        retrieveReservationsByGearId,
        retrieveReservationsByMemberId,
        retrieveOpenReservationsByGearId,
        retrieveOpenReservationsByMemberId
    };
};

const ReservationsContext = createContext<ReservationsContextProps | undefined>(undefined);

interface DataProviderProps {
    children: React.ReactNode;
}

export const ReservationsProvider: React.FC<DataProviderProps> = ({children}) => {
    const {reservationsData, setReservationsData} = useReservationsState();
    const [reservationRowSelectionModel, setReservationRowSelectionModel] =
        useState<GridRowSelectionModel>([]);
    const reservationOps = useReservationsOperations(reservationsData, setReservationsData);

    return (
        <ReservationsContext.Provider
            value={{
                reservationsData,
                setReservationsData,
                reservationRowSelectionModel,
                setReservationRowSelectionModel,
                ...reservationOps
            }}
        >
            {children}
        </ReservationsContext.Provider>
    );
};

export const useReservations = (): ReservationsContextProps => {
    const context = useContext(ReservationsContext);
    if (!context) {
        throw new Error("useReservations must be used within a ReservationsProvider");
    }
    return context;
};
