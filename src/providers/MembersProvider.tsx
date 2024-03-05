import {GridRowSelectionModel} from "@mui/x-data-grid";
import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import {getMembers, addMember, deleteMembers, updateMember} from "../utils/api";
import {MemberProps, NewMemberProps, NotificationProps, StaffProps} from "../utils/types";
import {useLogin} from "./LoginProvider";
import {useStaff} from "./StaffProvider";
import {useSnackbar} from "./SnackBarProvider";

interface MembersContextProps {
    membersData: MemberProps[];
    loggedInMember: MemberProps | null;
    setMembersData: React.Dispatch<React.SetStateAction<MemberProps[]>>;
    handleMemberUpdate: (modifiedMember: MemberProps) => Promise<MemberProps | null>;
    retrieveMemberById: (id: string) => MemberProps | null;
    handleMemberDelete: (selectedMember: MemberProps[]) => Promise<void>;
    handleMemberAdd: (newMemberData: NewMemberProps) => Promise<void>;
    memberRowSelectionModel: GridRowSelectionModel;
    setMemberRowSelectionModel: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>;
    validateRowSelection: () => boolean;
    refetchMembers: (ids: string[]) => Promise<void>;
}

const useMembersState = () => {
    const queryClient = useQueryClient();
    const [membersData, setMembersData] = useState<MemberProps[]>([]);
    const [loggedInMember, setLoggedInMember] = useState<MemberProps | null>(null);
    const {isStaff} = useLogin();
    const {addNotification} = useSnackbar();

    const {data: fetchMembersData} = useQuery("members", getMembers, {
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

    return {membersData, setMembersData, loggedInMember, setLoggedInMember};
};

const useMembersOperations = (
    membersData: MemberProps[],
    setMembersData: React.Dispatch<React.SetStateAction<MemberProps[]>>,
    memberRowSelectionModel: GridRowSelectionModel,
    setMemberRowSelectionModel: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>,
    setloggedInMember: React.Dispatch<React.SetStateAction<MemberProps | null>>
) => {
    const queryClient = useQueryClient();

    const {identity} = useLogin();
    const {addNotification} = useSnackbar();

    //TODO: don't allow staff to be deleted from members table.

    const {retrieveStaffById} = useStaff();

    const recomputeAggregatedMembers = () => {
        const aggregatedMembers = queryClient
            .getQueriesData<MemberProps>({queryKey: ["memberItem"], exact: false})
            .map((query) => query[1]);

        setMembersData(aggregatedMembers);
    };

    const handleMemberUpdate = async (modifiedMember: MemberProps): Promise<MemberProps | null> => {
        try {
            const updatedMember = await updateMember(modifiedMember);

            await refetchMembers([updatedMember._id]);

            recomputeAggregatedMembers();
            addNotification({message: "Successfully updated member!", type: "success"});
            return updatedMember;
        } catch (error: any) {
            addNotification({message: error.message, type: "error"});
            return null;
        }
    };

    /**
     *
     * @param id member id
     * @returns a member from the local database, different from getMember which fetches from mongodb
     * . Doing to limit unnecessary api calls.
     */
    const retrieveMemberById = useCallback(
        (id: string) => {
            return membersData.filter((member) => member._id === id)[0];
        },
        [membersData]
    );

    const loggedInMemberData = queryClient.getQueryData<MemberProps>([
        "memberItem",
        identity?.member_id
    ]);

    useEffect(() => {
        if (!loggedInMemberData) return;
        setloggedInMember(loggedInMemberData);
    }, [loggedInMemberData, setloggedInMember]);

    const handleMemberDelete = async (selectedMembers: MemberProps[]) => {
        const memberIds = selectedMembers.map((member) => member._id);
        const associatedStaff: StaffProps[] = selectedMembers
            .map((member) => (member.staff_id ? retrieveStaffById(member.staff_id) : null))
            .filter(Boolean) as StaffProps[];

        // Check if any members have associated staff
        if (associatedStaff.length > 0) {
            addNotification({
                message:
                    "Cannot delete members with associated staff. Please update staff records first.",
                type: "error"
            });
            return;
        }

        try {
            const deletedCount = await deleteMembers(memberIds);

            if (deletedCount !== memberIds.length) {
                throw new Error("Some members could not be deleted.");
            }

            await Promise.all(
                memberIds.map(async (id) => {
                    return queryClient.removeQueries({queryKey: ["memberItem", id]});
                })
            );

            recomputeAggregatedMembers();
            addNotification({
                message: `${deletedCount} members successfully deleted.`,
                type: "success"
            });
            setMemberRowSelectionModel([]);
        } catch (error: any) {
            addNotification({
                message: error.message || "Error deleting members. Try again later.",
                type: "error"
            });
        }
    };

    const handleMemberAdd = async (newMemberData: NewMemberProps) => {
        try {
            const addedMember = await addMember(newMemberData);

            queryClient.setQueryData(["memberItem", addedMember._id], addedMember);
            await queryClient.prefetchQuery(["memberItem", addedMember._id], {
                initialData: addedMember,
                staleTime: Infinity
            });

            recomputeAggregatedMembers();
            addNotification({message: "Member successfully added!", type: "success"});
        } catch (error: any) {
            addNotification({
                message: error.message || "Error adding member. Try again later.",
                type: "error"
            });
        }
    };

    const refetchMembers = async (ids: string[]) => {
        await Promise.all(
            ids.map((id) => {
                console.log("marking member", id, "as stale");
                return queryClient.refetchQueries(
                    {queryKey: ["memberItem", id]},
                    {throwOnError: true}
                );
            })
        );
        recomputeAggregatedMembers();
    };

    const validateRowSelection = () => {
        if (memberRowSelectionModel.length === 0) {
            const newNotification: NotificationProps = {
                message: "Select at least one row of members.",
                type: "error"
            };
            addNotification(newNotification);
            return false;
        } else {
            return true;
        }
    };

    return {
        handleMemberUpdate,
        retrieveMemberById,
        handleMemberDelete,
        handleMemberAdd,
        validateRowSelection,
        refetchMembers
    };
};

const MembersContext = createContext<MembersContextProps | undefined>(undefined);

interface DataProviderProps {
    children: React.ReactNode;
}

export const MembersProvider: React.FC<DataProviderProps> = ({children}) => {
    const {membersData, setMembersData, loggedInMember, setLoggedInMember} = useMembersState();
    const [memberRowSelectionModel, setMemberRowSelectionModel] = useState<GridRowSelectionModel>(
        []
    );
    const memberOps = useMembersOperations(
        membersData,
        setMembersData,
        memberRowSelectionModel,
        setMemberRowSelectionModel,
        setLoggedInMember
    );

    return (
        <MembersContext.Provider
            value={{
                membersData,
                setMembersData,
                loggedInMember,
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
