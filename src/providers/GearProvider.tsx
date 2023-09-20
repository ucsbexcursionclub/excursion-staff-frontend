import {GridRowSelectionModel} from "@mui/x-data-grid";
import React, {createContext, useContext, useEffect, useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import {
    addGear,
    addReservation,
    deleteGearItems,
    endReservations,
    getGear,
    updateGear
} from "src/utils/api";
import {GearProps, MemberProps, NewGearProps, NewReservationProps} from "src/utils/types";

interface GearContextProps {
    gearData: GearProps[];
    setGearData: React.Dispatch<React.SetStateAction<GearProps[]>>;
    handleGearUpdate: (modifiedGear: GearProps) => Promise<void>;
    retrieveGearItem: (id: string) => GearProps | undefined;
    handleGearDelete: (selectedGear: GearProps[]) => Promise<void>;
    handleGearCheckout: (selectedMember: MemberProps, selectedGear: GearProps[]) => Promise<void>;
    handleGearCheckin: (selectedGear: GearProps[]) => Promise<void>;
    handleGearAdd: (newGearData: NewGearProps) => Promise<void>;
}

export const useGearSelection = () => {
    const [gearRowSelectionModel, setGearRowSelectionModel] = useState<GridRowSelectionModel>([]);
    return {gearRowSelectionModel, setGearRowSelectionModel};
};

const useGearState = () => {
    const queryClient = useQueryClient();
    const [gearData, setGearData] = useState<GearProps[]>([]);

    const {data: fetchGearData} = useQuery("gear", getGear);

    useEffect(() => {
        if (fetchGearData) {
            setGearData(fetchGearData);
            fetchGearData.forEach(async (gearItem) => {
                queryClient.setQueryData(["gearItem", gearItem._id], gearItem);
                await queryClient.prefetchQuery(["gearItem", gearItem._id], {
                    initialData: gearItem,
                    staleTime: Infinity
                });
            });
        }
    }, [fetchGearData, queryClient]);

    return {gearData, setGearData};
};

const useGearOperations = (
    gearData: GearProps[],
    setGearData: React.Dispatch<React.SetStateAction<GearProps[]>>
) => {
    const {setGearRowSelectionModel} = useGearSelection();
    const queryClient = useQueryClient();

    const recomputeAggregatedGear = () => {
        const aggregatedGear = queryClient
            .getQueriesData<GearProps>({queryKey: ["gearItem"], exact: false})
            .map((query) => query[1]);

        setGearData(aggregatedGear);
    };

    const handleGearUpdate = async (modifiedGear: GearProps) => {
        const updatedGear = await updateGear(modifiedGear);

        await queryClient.refetchQueries({queryKey: ["gearItem", updatedGear._id]});
        recomputeAggregatedGear();
    };

    const retrieveGearItem = (id: string) => {
        return gearData.filter((gear) => gear._id === id)[0];
    };

    const handleGearDelete = async (selectedGear: GearProps[]) => {
        const stringIds = selectedGear.map((gear) => gear._id); //typesafe string ids from row selection model

        setGearRowSelectionModel([]);

        await deleteGearItems(stringIds);

        await Promise.all(
            stringIds.map(async (id) => {
                return queryClient.removeQueries({queryKey: ["gearItem", id]});
            })
        );

        recomputeAggregatedGear();
    };

    const handleGearAdd = async (newGearData: NewGearProps) => {
        const addedGear = await addGear(newGearData);

        queryClient.setQueryData(["gearItem", addedGear._id], addedGear);
        await queryClient.prefetchQuery(["gearItem", addedGear._id], {
            initialData: addedGear,
            staleTime: Infinity
        });

        recomputeAggregatedGear();
    };

    const handleGearCheckout = async (selectedMember: MemberProps, selectedGear: GearProps[]) => {
        setGearRowSelectionModel([]);

        const newReservationData: NewReservationProps = {
            reserved_gear: selectedGear.map((gear) => gear._id),
            reserving_member: selectedMember._id
        };

        await addReservation(newReservationData);

        await Promise.all(
            selectedGear.map(async (gear) => {
                return await queryClient.refetchQueries({queryKey: ["gearItem", gear._id]});
            })
        );

        recomputeAggregatedGear();
    };

    const handleGearCheckin = async (selectedGear: GearProps[]) => {
        setGearRowSelectionModel([]);

        const reservationIds = [...new Set(selectedGear.map((gear) => gear.current_reservation))];

        await endReservations(reservationIds);

        await Promise.all(
            selectedGear.map(async (gear) => {
                return await queryClient.refetchQueries({queryKey: ["gearItem", gear._id]});
            })
        );

        recomputeAggregatedGear();
    };

    return {
        handleGearUpdate,
        retrieveGearItem,
        handleGearDelete,
        handleGearAdd,
        handleGearCheckout,
        handleGearCheckin
    };
};

const GearContext = createContext<GearContextProps | undefined>(undefined);

interface DataProviderProps {
    children: React.ReactNode;
}

export const GearProvider: React.FC<DataProviderProps> = ({children}) => {
    const {gearData, setGearData} = useGearState();
    const gearOps = useGearOperations(gearData, setGearData);

    return (
        <GearContext.Provider value={{gearData, setGearData, ...gearOps}}>
            {children}
        </GearContext.Provider>
    );
};

export const useGear = (): GearContextProps => {
    const context = useContext(GearContext);
    if (!context) {
        throw new Error("useGear must be used within a GearProvider");
    }
    return context;
};
