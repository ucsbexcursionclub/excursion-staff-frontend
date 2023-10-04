import {GridRowSelectionModel} from "@mui/x-data-grid";
import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import {getMembers, addMember, deleteMembers, updateMembers} from "src/utils/api";
import {MemberProps, NewMemberProps} from "src/utils/types";
import {useLogin} from "./LoginProvider";
import {useStaff} from "./StaffProvider";

interface MembersContextProps {
    membersData: MemberProps[];
    currentMemberData: MemberProps | null;
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
    const [currentMemberData, setCurrentMemberData] = useState<MemberProps | null>();
    const {identity} = useLogin();

    const {data: fetchMembersData} = useQuery("members", getMembers, {
        enabled: ["admin", "staff"].includes(identity?.role) || isDeployedPreview
    });

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

    return {membersData, setMembersData, currentMemberData, setCurrentMemberData};
};

const useMembersOperations = (
    membersData: MemberProps[],
    setMembersData: React.Dispatch<React.SetStateAction<MemberProps[]>>,
    setMemberRowSelectionModel: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>,
    setCurrentMemberData: React.Dispatch<React.SetStateAction<MemberProps>>
) => {
    const queryClient = useQueryClient();

    const {identity} = useLogin();

    //TODO: don't allow staff to be deleted from members table.
    const {retrieveStaffById, handleStaffDelete} = useStaff();

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
    const retrieveMemberItem = useCallback(
        (id: string) => {
            return membersData.filter((member) => member._id === id)[0];
        },
        [membersData]
    );

    useEffect(() => {
        if (!identity) return;
        setCurrentMemberData(retrieveMemberItem(identity.member_id));
    }, [identity, retrieveMemberItem, setCurrentMemberData]);

    const handleMemberDelete = async (selectedMembers: MemberProps[]) => {
        const memberIds = selectedMembers.map((member) => member._id);
        const associatedStaff = selectedMembers
            .filter((member) => member.staff_id)
            .map((member) => retrieveStaffById(member.staff_id));

        setMemberRowSelectionModel([]);

        await deleteMembers(memberIds);

        await handleStaffDelete(associatedStaff);

        await Promise.all(
            memberIds.map(async (id) => {
                return queryClient.removeQueries({queryKey: ["memberItem", id]});
            })
        );

        recomputeAggregatedMembers();
    };

    const handleMemberAdd = async (newMemberData: NewMemberProps) => {
        const addedMember = await addMember(newMemberData);

        queryClient.setQueryData(["memberItem", addedMember._id], addedMember);
        await queryClient.prefetchQuery(["memberItem", addedMember._id], {
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
    const {membersData, setMembersData, currentMemberData, setCurrentMemberData} =
        useMembersState();
    const [memberRowSelectionModel, setMemberRowSelectionModel] = useState<GridRowSelectionModel>(
        []
    );
    const memberOps = useMembersOperations(
        membersData,
        setMembersData,
        setMemberRowSelectionModel,
        setCurrentMemberData
    );

    return (
        <MembersContext.Provider
            value={{
                membersData,
                setMembersData,
                currentMemberData,
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
