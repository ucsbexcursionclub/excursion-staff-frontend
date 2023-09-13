export type MemberProps = {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    membership_status: "Three Months" | "Six Months" | "Full Year" | "Staff";
    is_new_member: boolean;
    membership_expiration_date: number | null;
};
