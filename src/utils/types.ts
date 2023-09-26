export type MemberProps = {
    _id: string;
    name: string;
    email: string;
    phone_number: string;
    membership_duration: number;
    membership_status: "member" | "staff" | "admin";
    is_new_member: boolean;
    signed_up_by: string;
    membership_expiration_date: number | null;
    join_datetime: number;
    notes: string | null;
};

export type NewMemberProps = Omit<
    MemberProps,
    "_id" | "membership_expiration_date" | "join_datetime" | "notes" | "membership_status"
>;

export type StaffMemberProps = {
    _id: string;
    name: string;
    email: string;
    phone_number: string;
    is_new_member: boolean;
    membership_expiration_date: number | null;
    membership_duration: number;
    join_datetime: number;
    signed_up_by: string | null;
    notes: string;
    staff_details: {
      _id: string;
      member_id: string;
      profileImageUrl: string;
      bio: string;
      positions: string[];
    };
  };  

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
