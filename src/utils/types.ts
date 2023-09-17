export type MemberProps = {
    _id: string;
    name: string;
    email: string;
    phone_number: string;
    membership_status: "Three Months" | "Six Months" | "Full Year" | "Staff";
    is_new_member: boolean;
    membership_expiration_date: number | null;
};

export type GearProps = {
    _id: string;
    rfid: number | null;
    gear_name: string;
    is_missing: boolean;
    is_broken: boolean;
    description: string | null;
    prev_description: string | null;
  };