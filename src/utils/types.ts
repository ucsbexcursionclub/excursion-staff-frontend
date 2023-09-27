export type MemberProps = {
    _id: string;
    name: string;
    email: string;
    phone_number: string;
    membership_duration: number;
    is_new_member: boolean;
    signed_up_by: string;
    membership_expiration_date: number | null;
    join_datetime: number;
    notes: string | null;
    staffId?: string;
};

export type StaffProps = {
    _id: string;
    memberId: string;
    memberDetails?: MemberProps;
    positions: string[];
    profileImageUrl: string;
    bio: string;
};

export type NewMemberProps = Omit<
    MemberProps,
    "_id" | "membership_expiration_date" | "join_datetime" | "notes"
>;

export type NewStaffMemberProps = {
    name: string;
    staff_details: {
        positions: string[];
    };
};

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
    reserved_gear: string[];
    reserving_member: string;
    due_date: number;
    last_contacted: number | null;
    memberDetails?: MemberProps;
};

export type NewReservationProps = Omit<
    ReservationProps,
    "_id" | "due_date" | "last_contacted" | "memberDetails"
>;
