export type MemberProps = {
    _id: string;
    name: string;
    email: string;
    phone_number: string;
    membership_status: "Three Months" | "Six Months" | "Full Year" | "Staff";
    is_new_member: boolean;
    membership_expiration_date: number | null;
};

export type NewMemberProps = Omit<MemberProps, "_id" | "membership_expiration_date">;

export type GearProps = {
    _id: string;
    rfid: number | null;
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
};

export type NewReservationProps = Omit<ReservationProps, "_id" | "due_date" | "last_contacted">;
