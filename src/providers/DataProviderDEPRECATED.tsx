import React, {createContext, useContext, useState, useEffect} from "react";
import {useQuery, useQueryClient} from "react-query";
import {
    addGear,
    addReservation,
    deleteGearItems,
    endReservations,
    getGear,
    getMembers,
    updateGear
} from "../utils/api";
import {GearProps, MemberProps, NewGearProps, NewReservationProps} from "../utils/types";
import {GridRowSelectionModel} from "@mui/x-data-grid";

interface GearContextProps {
    gearData: GearProps[];
    setGearData: React.Dispatch<React.SetStateAction<GearProps[]>>;
    membersData: MemberProps[];
    setMembersData: React.Dispatch<React.SetStateAction<MemberProps[]>>;
    handleGearUpdate: (modifiedGear: GearProps) => Promise<void>;
    retrieveGearItem: (id: string) => GearProps | undefined;
    handleGearDelete: (selectedGear: GearProps[]) => Promise<void>;
    handleGearCheckout: (selectedMember: MemberProps, selectedGear: GearProps[]) => Promise<void>;
    handleGearCheckin: (selectedGear: GearProps[]) => Promise<void>;
    handleGearAdd: (newGearData: NewGearProps) => Promise<void>;
    gearRowSelectionModel: GridRowSelectionModel;
    setGearRowSelectionModel: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>;
}

const DataContext = createContext<GearContextProps | undefined>(undefined);

interface DataProviderProps {
    children: React.ReactNode;
}

export const DataProviderDEPRECATED: React.FC<DataProviderProps> = ({children}) => {
    const queryClient = useQueryClient();

    const [initialGearData, setInitialGearData] = useState<GearProps[]>([]);
    const [gearData, setGearData] = useState<GearProps[]>([]);

    const {data: fetchGearData} = useQuery("gear", getGear);

    //fetches initial gear from DB and sets it to gearData
    useEffect(() => {
        if (fetchGearData) {
            setInitialGearData(fetchGearData);

            fetchGearData.forEach(async (gearItem) => {
                queryClient.setQueryData(["gearItem", gearItem._id], gearItem);
                await queryClient.prefetchQuery(["gearItem", gearItem._id], {
                    initialData: gearItem,
                    staleTime: Infinity
                });
            });
        }
    }, [fetchGearData, queryClient]);

    //once all gear is pulled from db, we make a new query so we can individually store each gear
    //item. we will use gearItem query as the main data source in our app, when a gear item is modified
    //we can just invalidate it here and refetch it from the db. This is setup so when we mutate an
    //item we don't have to refetch the entire db again.

    function recomputeAggregatedGear() {
        const aggregatedGear = queryClient
            .getQueriesData<GearProps>({queryKey: ["gearItem"], exact: false})
            .map((query) => query[1]);

        setGearData(aggregatedGear);
    }
    //once initialGearData, we the index each gear item into an individual query so now we can,
    //refetch individual gear items.
    useEffect(() => {
        //need to make sure this updates once an individual gear is refetched
        const aggregatedGear = queryClient
            .getQueriesData<GearProps>({queryKey: ["gearItem"], exact: false})
            .map((query) => query[1]);

        setGearData(aggregatedGear);
    }, [queryClient, initialGearData]);

    const [membersData, setMembersData] = useState<MemberProps[]>([]);

    const [gearRowSelectionModel, setGearRowSelectionModel] = React.useState<GridRowSelectionModel>(
        []
    );

    const {data: fetchMembersData} = useQuery("members", getMembers);

    useEffect(() => {
        if (fetchMembersData) {
            setMembersData(fetchMembersData);
        }
    }, [fetchMembersData]);

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

    return (
        <DataContext.Provider
            value={{
                gearData,
                setGearData,
                membersData,
                setMembersData,
                handleGearUpdate,
                retrieveGearItem,
                handleGearDelete,
                handleGearCheckout,
                handleGearCheckin,
                handleGearAdd,
                gearRowSelectionModel,
                setGearRowSelectionModel
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useDataDEPRECATED = (): GearContextProps => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
};
