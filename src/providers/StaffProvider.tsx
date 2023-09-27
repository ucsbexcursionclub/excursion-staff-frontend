import React, {createContext, useContext, useEffect, useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import {getStaffMembers} from "src/utils/api"; // Adjust the API functions as needed
import {StaffProps} from "src/utils/types";
import {useLogin} from "./LoginProvider";

interface StaffContextProps {
    // staffData: StaffMemberProps[];
    // setStaffData: React.Dispatch<React.SetStateAction<StaffMemberProps[]>>;
    // Add any other functions or data you need here
}

const useStaffState = () => {
    const queryClient = useQueryClient();
    const [staffData, setStaffData] = useState<StaffProps[]>([]);
    const {isLoggedIn} = useLogin();

    const {data: fetchStaffData} = useQuery("staff", getStaffMembers, {
        enabled: isLoggedIn
    });

    useEffect(() => {
        if (fetchStaffData) {
            setStaffData(fetchStaffData);
            fetchStaffData.forEach(async (staffMember) => {
                queryClient.setQueryData(["staffItem", staffMember._id], staffMember);
                await queryClient.prefetchQuery(["staffItem", staffMember._id], {
                    initialData: staffMember,
                    staleTime: Infinity
                });
            });
        }
    }, [fetchStaffData, queryClient]);

    return {staffData, setStaffData};
};

const useStaffOperations = (
    staffData: StaffProps[],
    setStaffData: React.Dispatch<React.SetStateAction<StaffProps[]>>
) => {
    const recomputeAggregatedStaff = () => {
        const aggregatedStaff = queryClient
            .getQueriesData<StaffProps>({queryKey: ["staffItem"], exact: false})
            .map((query) => query[1]);

        setStaffData(aggregatedStaff);
    };

    const queryClient = useQueryClient();

    const handleStaffUpdate = async (modifiedStaff: StaffProps) => {
        const updatedStaff = await updateStaff(modifiedStaff);

        await queryClient.refetchQueries({queryKey: ["staffItem", modifiedStaff._id]});
        recomputeAggregatedStaff();
    };

    const handleProfileImageUpload = async (staffId: string, uploadedFile) {
        
    }
};

const StaffContext = createContext<StaffContextProps | undefined>(undefined);

interface StaffProviderProps {
    children: React.ReactNode; // Explicitly specify children prop
}

export const StaffProvider: React.FC<StaffProviderProps> = ({children}) => {
    const {staffData, setStaffData} = useStaffState();
    const staffOps = useStaffOperations(staffData, setStaffData);

    return (
        <StaffContext.Provider
            value={{
                staffData,
                setStaffData
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
