import {useLogin} from "./LoginProvider";
import {useStaff} from "./StaffProvider";
import {hasBoardPosition} from "../utils/constants";

/** Whether the logged-in user holds a board position (Director, Treasurer, General Board). */
export function useBoardAccess(): {isBoardMember: boolean; isLoading: boolean} {
    const {identity, isStaff} = useLogin();
    const {staffData} = useStaff();

    // The logged-in staff member is always in the staff list once it has loaded
    const isLoading = isStaff && staffData.length === 0;
    const ownStaffRecord = identity
        ? staffData.find((staff) => String(staff.member_id) === String(identity.member_id))
        : undefined;

    return {isBoardMember: hasBoardPosition(ownStaffRecord?.positions), isLoading};
}
