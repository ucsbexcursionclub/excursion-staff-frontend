import {GridRowSelectionModel} from "@mui/x-data-grid";
import React, {createContext, useContext, useEffect, useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import {getMembers, addMember, deleteMembers, updateMembers} from "src/utils/api";
import {MemberProps, NewMemberProps} from "src/utils/types";

interface MembersContextProps {
    membersData: MemberProps[];
    setMembersData: React.Dispatch<React.SetStateAction<MemberProps[]>>;
    handleMemberUpdate: (modifiedMember: MemberProps) => Promise<void>;
    retrieveMemberItem: (id: string) => MemberProps | undefined;
    handleMemberDelete: (selectedMember: MemberProps[]) => Promise<void>;
    handleMemberAdd: (newMemberData: NewMemberProps) => Promise<void>;
    memberRowSelectionModel: GridRowSelectionModel;
    setMemberRowSelectionModel: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>;
}

const useMembersState = () => {
    const queryClient = useQueryClient();
    const [membersData, setMembersData] = useState<MemberProps[]>([]);

    const {data: fetchMembersData} = useQuery("members", getMembers);

    useEffect(() => {
        if (fetchMembersData) {
            setMembersData(fetchMembersData);
            fetchMembersData.forEach(async (memberItem) => {
                queryClient.setQueryData(["memberItem", memberItem._id], memberItem);
                await queryClient.prefetchQuery(["memberItem", memberItem._id], {
                    initialData: memberItem,
                    staleTime: Infinity
                });
            });
        }
    }, [fetchMembersData, queryClient]);

    return {membersData, setMembersData};
};

const useMembersOperations = (
    membersData: MemberProps[],
    setMembersData: React.Dispatch<React.SetStateAction<MemberProps[]>>,
    setMemberRowSelectionModel: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>
) => {
    const queryClient = useQueryClient();

    const recomputeAggregatedMembers = () => {
        const aggregatedMembers = queryClient
            .getQueriesData<MemberProps>({queryKey: ["memberItem"], exact: false})
            .map((query) => query[1]);

        setMembersData(aggregatedMembers);
    };

    const handleMemberUpdate = async (modifiedMember: MemberProps) => {
        const updatedMember = await updateMembers(modifiedMember);

        await queryClient.refetchQueries({queryKey: ["memberItem", updatedMember._id]});
        recomputeAggregatedMembers();
    };

    /**
     *
     * @param id member id
     * @returns a member from the local database, different from getMember which fetches from mongodb
     * . Doing to limit unnecessary api calls.
     */
    const retrieveMemberItem = (id: string) => {
        return membersData.filter((member) => member._id === id)[0];
    };

    const handleMemberDelete = async (selectedMember: MemberProps[]) => {
        selectedMember;
        const memberIds = selectedMember.map((member) => member._id);

        setMemberRowSelectionModel([]);

        await deleteMembers(memberIds);

        await Promise.all(
            memberIds.map(async (id) => {
                return queryClient.removeQueries({queryKey: ["memberItem", id]});
            })
        );

        recomputeAggregatedMembers();
    };

    const handleMemberAdd = async (newMemberData: NewMemberProps) => {
        newMemberData;
        const addedMember = await addMember(newMemberData);

        // Refetch the "members" query to get the updated data
        await queryClient.refetchQueries({queryKey: "members"});

        queryClient.setQueryData(["memberData", addedMember._id], addedMember);
        await queryClient.prefetchQuery(["memberData", addedMember._id], {
            initialData: addedMember,
            staleTime: Infinity
        });

        recomputeAggregatedMembers();
    };

    return {
        handleMemberUpdate,
        retrieveMemberItem,
        handleMemberDelete,
        handleMemberAdd
    };
};

const MembersContext = createContext<MembersContextProps | undefined>(undefined);

interface DataProviderProps {
    children: React.ReactNode;
}

export const MembersProvider: React.FC<DataProviderProps> = ({children}) => {
    const {membersData, setMembersData} = useMembersState();
    const [memberRowSelectionModel, setMemberRowSelectionModel] = useState<GridRowSelectionModel>(
        []
    );
    const memberOps = useMembersOperations(membersData, setMembersData, setMemberRowSelectionModel);

    return (
        <MembersContext.Provider
            value={{
                membersData,
                setMembersData,
                memberRowSelectionModel,
                setMemberRowSelectionModel,
                ...memberOps
            }}
        >
            {children}
        </MembersContext.Provider>
    );
};

export const useMembers = (): MembersContextProps => {
    const context = useContext(MembersContext);
    if (!context) {
        throw new Error("useMembers must be used within a MembersProvider");
    }
    return context;
};
