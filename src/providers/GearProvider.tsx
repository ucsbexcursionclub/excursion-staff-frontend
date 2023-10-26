import {GridRowSelectionModel} from "@mui/x-data-grid";
import React, {createContext, useContext, useEffect, useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import {addGear, checkInGear, deleteGearItems, getGear, updateGear} from "../utils/api";
import {GearProps, MemberProps, NewGearProps, NotificationProps} from "../utils/types";
import {useReservations} from "./ReservationProvider";
import {useLogin} from "./LoginProvider";
import {useSnackbar} from "./SnackBarProvider";

interface GearContextProps {
    gearData: GearProps[];
    setGearData: React.Dispatch<React.SetStateAction<GearProps[]>>;
    handleGearUpdate: (modifiedGear: GearProps) => Promise<void>;
    retrieveGearItem: (id: string) => GearProps | undefined;
    retrieveGearItemByRFID: (rfid: string) => GearProps | undefined;
    handleGearDelete: (selectedGear: GearProps[]) => Promise<void>;
    handleGearCheckout: (selectedMember: MemberProps, selectedGear: GearProps[]) => Promise<void>;
    handleGearCheckin: (selectedGear: GearProps[]) => Promise<void>;
    handleGearAdd: (newGearData: NewGearProps) => Promise<void>;
    // getMemberOverdueGear: (selectedMemberId: string) => Promise<[GearProps, Date][]>;
    setGearRowSelectionModel: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>;
    gearRowSelectionModel: GridRowSelectionModel;
    validateRowSelection: () => boolean;
}

const useGearState = () => {
    const queryClient = useQueryClient();
    const [gearData, setGearData] = useState<GearProps[]>([]);
    const {isStaff} = useLogin();

    const {data: fetchGearData} = useQuery("gear", getGear, {
        enabled: isStaff
    });

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
    setGearData: React.Dispatch<React.SetStateAction<GearProps[]>>,
    gearRowSelectionModel: GridRowSelectionModel,
    setGearRowSelectionModel: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>
) => {
    const queryClient = useQueryClient();

    const {handleReservationAdd, refetchReservations} = useReservations();
    const {addNotification} = useSnackbar();

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

    const retrieveGearItemByRFID = (rfid: string) => {
        return gearData.filter((gear) => gear.rfid === rfid)[0];
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

        await handleReservationAdd(selectedMember, selectedGear);
        await Promise.all(
            selectedGear.map(async (gear) => {
                return await queryClient.refetchQueries({queryKey: ["gearItem", gear._id]});
            })
        );

        recomputeAggregatedGear();
    };

    const handleGearCheckin = async (selectedGear: GearProps[]) => {
        setGearRowSelectionModel([]);

        await checkInGear(selectedGear.map((gear) => gear._id));

        await Promise.all(
            selectedGear.map(async (gear) => {
                return await queryClient.refetchQueries({queryKey: ["gearItem", gear._id]});
            })
        );

        const reservationIds = selectedGear
            .map((gear) => gear.current_reservation)
            .filter(Boolean) as string[];

        await refetchReservations(reservationIds);

        recomputeAggregatedGear();
    };

    const validateRowSelection = () => {
        if (gearRowSelectionModel.length === 0) {
            const newNotification: NotificationProps = {
                message: "Select at least one row of gear.",
                type: "error"
            };
            addNotification(newNotification);
            return false;
        } else {
            return true;
        }
    };

    return {
        handleGearUpdate,
        retrieveGearItem,
        retrieveGearItemByRFID,
        handleGearDelete,
        handleGearAdd,
        handleGearCheckout,
        handleGearCheckin,
        validateRowSelection
    };
};

const GearContext = createContext<GearContextProps | undefined>(undefined);

interface DataProviderProps {
    children: React.ReactNode;
}

export const GearProvider: React.FC<DataProviderProps> = ({children}) => {
    const {gearData, setGearData} = useGearState();
    const [gearRowSelectionModel, setGearRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gearOps = useGearOperations(
        gearData,
        setGearData,
        gearRowSelectionModel,
        setGearRowSelectionModel
    );

    return (
        <GearContext.Provider
            value={{
                gearData,
                setGearData,
                gearRowSelectionModel,
                setGearRowSelectionModel,
                ...gearOps
            }}
        >
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
