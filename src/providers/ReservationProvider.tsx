import {GridRowSelectionModel} from "@mui/x-data-grid";
import React, {createContext, useContext, useEffect, useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import {addReservation, getReservations, updateReservation} from "../utils/api";
import {
    GearProps,
    MemberProps,
    NewReservationProps,
    NotificationProps,
    ReservationProps
} from "../utils/types";
import {useLogin} from "./LoginProvider";
import {useSnackbar} from "./SnackBarProvider";

interface ReservationsContextProps {
    reservationsData: ReservationProps[];
    setReservationsData: React.Dispatch<React.SetStateAction<ReservationProps[]>>;
    handleReservationAdd: (selectedMember: MemberProps, selectedGear: GearProps[]) => Promise<void>;
    handleReservationUpdate: (
        modifiedReservation: ReservationProps
    ) => Promise<ReservationProps | null>;
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
    const {addNotification} = useSnackbar();

    const {data: fetchReservationsData} = useQuery("reservations", getReservations, {
        enabled: isStaff,
        onError: (err: Error) => {
            const newNotification: NotificationProps = {
                message: err.message,
                type: "error"
            };
            addNotification(newNotification);
        }
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

    const {addNotification} = useSnackbar();

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
        try {
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
            addNotification({message: "Reservation successfully added!", type: "success"});
        } catch (error: any) {
            addNotification({
                message: error.message || "Error adding reservation. Try again later.",
                type: "error"
            });
        }
    };

    const handleReservationUpdate = async (
        modifiedReservation: ReservationProps
    ): Promise<ReservationProps | null> => {
        try {
            const updatedReservation = await updateReservation(modifiedReservation);

            await refetchReservations([updatedReservation._id]);

            recomputeAggregatedReservations();
            addNotification({message: "Successfully updated reservation!", type: "success"});
            return updatedReservation;
        } catch (error: any) {
            addNotification({message: error.message, type: "error"});
            return null;
        }
    };

    const refetchReservations = async (ids: string[]) => {
        await Promise.all(
            ids.map(async (id) => {
                return await queryClient.refetchQueries(
                    {
                        queryKey: ["reservationItem", id]
                    },
                    {throwOnError: true}
                );
            })
        );
        recomputeAggregatedReservations();
    };

    return {
        handleReservationAdd,
        handleReservationUpdate,
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
