import {AlertColor} from "@mui/material";

export type MemberProps = {
    _id: string;
    name: string;
    email: string;
    phone_number: string;
    membership_duration: number;
    local_living_address: string;
    is_new_member: boolean;
    signed_up_by: string;
    membership_expiration_date: number;
    join_datetime: number;
    notes: string | null;
    flagged?: boolean;
    staff_id?: string;
};

export type NotificationProps = {
    message: string;
    key?: number;
    type?: AlertColor;
};

export type StaffProfile = {
    name: string;
    email: string;
    positions: string[];
    profileImagePath: string | null;
    bio: string;
};

export type IdentityProps = {
    member_id: string;
    _id: string;
    role: "user" | "staff" | "admin";
};

export type StaffProps = {
    _id: string;
    member_id: string;
    memberDetails?: MemberProps;
    positions: string[];
    profileImagePath: string | null;
    bio: string;
    role?: IdentityProps["role"];
};

export type NewMemberProps = Omit<
    MemberProps,
    "_id" | "membership_expiration_date" | "join_datetime"
>;

export type NewStaffProps = Partial<StaffProps>;

export type GearProps = {
    _id: string;
    rfid: string | null;
    gear_name: string;
    is_missing: boolean;
    is_broken: boolean;
    date_added: number;
    description: string | null;
    notes: string | null;
    current_reservation: string | null;
    previous_reservations: string[];
    reservationDetails?: ReservationProps;
    memberDetails?: MemberProps;
};

export type NewGearProps = Omit<
    GearProps,
    | "_id"
    | "date_added"
    | "is_missing"
    | "is_broken"
    | "current_reservation"
    | "previous_reservations"
    | "reservationDetails"
    | "memberDetails"
>;

export type ReservationProps = {
    _id: string;
    checked_out_gear: string[];
    checked_in_gear: string[];
    reserving_member: string;
    due_date: number;
    last_contacted: number | null;
    memberDetails?: MemberProps;
};

export type NewReservationProps = Omit<
    ReservationProps,
    "_id" | "due_date" | "last_contacted" | "memberDetails" | "checked_in_gear"
>;

export type CommentCategory = "general" | "warning" | "commendation";

export type MemberProfileComment = {
    _id: string;
    comment: string;
    category: CommentCategory;
    created_at: number;
    updated_at: number;
    author_member_id: string | null;
    author_name: string | null;
};

export type MemberProfileData = {
    _id: string;
    name: string;
    email: string;
    phone_number: string | null;
    local_living_address: string;
    membership_duration: number;
    membership_expiration_date: number | null;
    join_datetime: number;
    is_new_member: boolean;
    notes: string | null;
    staff_id?: string;
    profile_comments?: MemberProfileComment[];
};

export type RentalHistoryGearDetail = {
    _id: string;
    rfid: number | null;
    gear_name: string;
    is_missing: boolean;
    is_broken: boolean;
};

export type RentalHistoryItem = {
    _id: string;
    reserving_member: string;
    due_date: number;
    last_contacted: number | null;
    checked_out_gear: string[];
    checked_in_gear: string[];
    checked_out_gear_details: RentalHistoryGearDetail[];
    checked_in_gear_details: RentalHistoryGearDetail[];
};

export type TripMemberDetails = {
    _id: string;
    name: string;
    email: string;
    phone_number: string | null;
    local_living_address: string;
};

export type TripStaffDetails = {
    _id: string;
    member_id: string;
    positions: string[];
    profileImagePath: string;
    bio: string;
    memberDetails?: {
        _id: string;
        name: string;
        email: string;
    };
};

export type TripMemberParticipant = {
    member_id: string;
    comment: string | null;
    attendance_status: "planned" | "attended" | "cancelled";
    added_at: number;
    memberDetails?: TripMemberDetails;
};

export type TripStaffParticipant = {
    staff_id: string;
    comment: string | null;
    added_at: number;
    staffDetails?: TripStaffDetails;
};

export type TripComment = {
    _id: string;
    comment: string;
    category: CommentCategory;
    created_at: number;
    updated_at: number;
    author_member_id: string | null;
    author_name: string | null;
    target_member_id: string | null;
};

export type TripProps = {
    _id: string;
    title: string;
    trip_date: number;
    end_date: number | null;
    location: string | null;
    description: string | null;
    created_at: number;
    updated_at: number;
    member_participants?: TripMemberParticipant[];
    staff_participants?: TripStaffParticipant[];
    comments?: TripComment[];
};

export type MemberProfileResponse = {
    member: MemberProfileData;
    rental_history: RentalHistoryItem[];
    trip_history: TripProps[];
    staff_profile: StaffProps | null;
};

export type NewMemberProfileComment = {
    comment: string;
    category: CommentCategory;
};

export type NewTripComment = {
    comment: string;
    category?: CommentCategory;
    target_member_id?: string | null;
};

export type NewTripMemberParticipant = {
    member_id: string;
    comment?: string | null;
    attendance_status?: "planned" | "attended" | "cancelled";
    added_at?: number;
};

export type NewTripStaffParticipant = {
    staff_id: string;
    comment?: string | null;
    added_at?: number;
};

export type NewTripProps = {
    title: string;
    trip_date: number | string;
    end_date?: number | string | null;
    location?: string | null;
    description?: string | null;
    member_participants?: NewTripMemberParticipant[];
    staff_participants?: NewTripStaffParticipant[];
    comments?: Array<{
        comment: string;
        category?: CommentCategory;
        target_member_id?: string | null;
    }>;
};

export type UpdateTripProps = Partial<NewTripProps>;
