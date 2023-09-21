import {GridRowSelectionModel} from "@mui/x-data-grid";
import React, {createContext, useContext, useEffect, useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import {addReservation, endReservations, getReservations} from "src/utils/api";
import {GearProps, MemberProps, NewReservationProps, ReservationProps} from "src/utils/types";

interface ReservationsContextProps {
    reservationsData: ReservationProps[];
    setReservationsData: React.Dispatch<React.SetStateAction<ReservationProps[]>>;
    handleReservationAdd: (selectedMember: MemberProps, selectedGear: GearProps[]) => Promise<void>;
    handleReservationEnd: (reservationIds: string[]) => Promise<void>;
    reservationRowSelectionModel: GridRowSelectionModel;
    retrieveReservation: (id: string) => ReservationProps;
    setReservationRowSelectionModel: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>;
}

const useReservationsState = () => {
    const queryClient = useQueryClient();
    const [reservationsData, setReservationsData] = useState<ReservationProps[]>([]);

    const {data: fetchReservationsData} = useQuery("reservations", getReservations);

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
    setReservationsData: React.Dispatch<React.SetStateAction<ReservationProps[]>>,
    setReservationRowSelectionModel: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>
) => {
    const queryClient = useQueryClient();

    setReservationRowSelectionModel; //same as above

    const recomputeAggregatedReservations = () => {
        const aggregatedReservations = queryClient
            .getQueriesData<ReservationProps>({queryKey: ["reservationItem"], exact: false})
            .map((query) => query[1]);

        setReservationsData(aggregatedReservations);
    };

    const retrieveReservation = (id: string) => {
        return reservationsData.filter((reservation) => reservation._id === id)[0];
    };

    const handleReservationAdd = async (selectedMember: MemberProps, selectedGear: GearProps[]) => {
        const newReservationData: NewReservationProps = {
            reserved_gear: selectedGear.map((gear) => gear._id),
            reserving_member: selectedMember._id
        };

        const addedReservation = await addReservation(newReservationData);

        queryClient.setQueryData(["reservationItem", addedReservation._id], addedReservation);
        await queryClient.prefetchQuery(["reservationItem", addedReservation._id], {
            initialData: addedReservation,
            staleTime: Infinity
        });

        recomputeAggregatedReservations();
    };

    const handleReservationEnd = async (reservationIds: string[]) => {
        await endReservations(reservationIds);

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
        handleReservationEnd,
        retrieveReservation
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
    const reservationOps = useReservationsOperations(
        reservationsData,
        setReservationsData,
        setReservationRowSelectionModel
    );

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
