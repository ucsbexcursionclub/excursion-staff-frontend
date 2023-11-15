import React, {createContext, useContext, useEffect, useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import {addStaff, deleteStaff, getStaff, updateStaff} from "../utils/api"; // Adjust the API functions as needed
import {NewStaffProps, NotificationProps, StaffProps} from "../utils/types";
import {useLogin} from "./LoginProvider";
import {GridRowSelectionModel} from "@mui/x-data-grid";
import {useSnackbar} from "./SnackBarProvider";

interface StaffContextProps {
    staffData: StaffProps[];
    setStaffData: React.Dispatch<React.SetStateAction<StaffProps[]>>;
    staffRowSelectionModel: GridRowSelectionModel;
    setStaffRowSelectionModel: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>;
    retrieveStaffById: (id: string) => StaffProps | null;
    retrieveStaffByMemberID: (memberID: string) => StaffProps | null;
    handleStaffDelete: (selectedStaff: StaffProps[]) => Promise<void>;
    handleStaffAdd: (newStaffData: NewStaffProps) => Promise<void>;
    refetchStaff: (ids: string[]) => Promise<void>;
    handleStaffUpdate: (modifiedStaff: StaffProps) => Promise<StaffProps | null>;
    validateRowSelection: () => boolean;
}

const useStaffState = () => {
    const queryClient = useQueryClient();
    const [staffData, setStaffData] = useState<StaffProps[]>([]);
    const {identity} = useLogin();
    const {addNotification} = useSnackbar();

    const {data: fetchStaffData} = useQuery("staff", getStaff, {
        enabled: !!identity && ["admin", "staff"].includes(identity.role),
        onError: (err: Error) => {
            const newNotification: NotificationProps = {
                message: err.message,
                type: "error"
            };
            addNotification(newNotification);
        }
    });

    useEffect(() => {
        if (fetchStaffData) {
            setStaffData(fetchStaffData);
            fetchStaffData.forEach(async (staff) => {
                queryClient.setQueryData(["staffItem", staff._id], staff);
                await queryClient.prefetchQuery(["staffItem", staff._id], {
                    initialData: staff,
                    staleTime: Infinity
                });
            });
        }
    }, [fetchStaffData, queryClient]);

    return {staffData, setStaffData};
};

const useStaffOperations = (
    staffData: StaffProps[],
    setStaffData: React.Dispatch<React.SetStateAction<StaffProps[]>>,
    staffRowSelectionModel: GridRowSelectionModel,
    setStaffRowSelectionModel: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>
) => {
    const recomputeAggregatedStaff = () => {
        const aggregatedStaff = queryClient
            .getQueriesData<StaffProps>({queryKey: ["staffItem"], exact: false})
            .map((query) => query[1]);

        setStaffData(aggregatedStaff);
    };

    const {addNotification} = useSnackbar();

    const queryClient = useQueryClient();

    const retrieveStaffById = (id: string): StaffProps | null => {
        return staffData.filter((staff) => staff._id === id)[0];
    };

    const retrieveStaffByMemberID = (member_id: string): StaffProps | null => {
        return staffData.filter((staff) => staff.member_id === member_id)[0];
    };

    const handleStaffDelete = async (selectedStaff: StaffProps[]) => {
        const staffIds = selectedStaff.map((staff) => staff._id);

        setStaffRowSelectionModel([]);

        await deleteStaff(staffIds);

        await Promise.all(
            staffIds.map(async (id) => {
                return queryClient.removeQueries({queryKey: ["staffItem", id]});
            })
        );

        recomputeAggregatedStaff();
    };

    const handleStaffAdd = async (newStaffData: NewStaffProps) => {
        try {
            const addedStaff = await addStaff(newStaffData);

            queryClient.setQueryData(["staffItem", addedStaff._id], addedStaff);
            await queryClient.prefetchQuery(["staffItem", addedStaff._id], {
                initialData: addedStaff,
                staleTime: Infinity
            });

            recomputeAggregatedStaff();
            addNotification({message: "Staff member successfully added!", type: "success"});
        } catch (error: any) {
            addNotification({
                message: error.message || "Error adding staff member. Try again later.",
                type: "error"
            });
        }
    };

    const handleStaffUpdate = async (modifiedStaff: StaffProps): Promise<StaffProps | null> => {
        try {
            const updatedStaff = await updateStaff(modifiedStaff);

            await refetchStaff([updatedStaff._id]);
            recomputeAggregatedStaff();

            addNotification({message: "Successfully updated staff!", type: "success"});
            return updatedStaff;
        } catch (error: any) {
            addNotification({message: error.message, type: "error"});
            return null;
        }
    };

    const validateRowSelection = () => {
        if (staffRowSelectionModel.length === 0) {
            const newNotification: NotificationProps = {
                message: "Select at least one row of staff.",
                type: "error"
            };
            addNotification(newNotification);
            return false;
        } else {
            return true;
        }
    };

    const refetchStaff = async (ids: string[]) => {
        await Promise.all(
            ids.map(async (id) => {
                return await queryClient.refetchQueries(
                    {
                        queryKey: ["staffItem", id]
                    },
                    {throwOnError: true}
                );
            })
        );
        recomputeAggregatedStaff();
    };

    return {
        handleStaffUpdate,
        retrieveStaffById,
        retrieveStaffByMemberID,
        handleStaffDelete,
        handleStaffAdd,
        validateRowSelection,
        refetchStaff
    };
};

const StaffContext = createContext<StaffContextProps | undefined>(undefined);

interface StaffProviderProps {
    children: React.ReactNode;
}

export const StaffProvider: React.FC<StaffProviderProps> = ({children}) => {
    const {staffData, setStaffData} = useStaffState();
    const [staffRowSelectionModel, setStaffRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const staffOps = useStaffOperations(
        staffData,
        setStaffData,
        staffRowSelectionModel,
        setStaffRowSelectionModel
    );

    return (
        <StaffContext.Provider
            value={{
                staffData,
                setStaffData,
                staffRowSelectionModel,
                setStaffRowSelectionModel,
                ...staffOps
            }}
        >
            {children}
        </StaffContext.Provider>
    );
};

export const useStaff = (): StaffContextProps => {
    const context = useContext(StaffContext);
    if (!context) {
        throw new Error("useStaff must be used within a StaffProvider");
    }
    return context;
};
