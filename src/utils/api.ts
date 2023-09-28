import {
    GearProps,
    MemberProps,
    NewGearProps,
    NewReservationProps,
    ReservationProps,
    NewMemberProps,
    StaffProps,
    NewStaffProps
} from "./types";
import axios from "axios";

import Cookies from "universal-cookie";
import {parseJwt} from "./utils";
const cookies = new Cookies();

const baseURL =
    process.env.NODE_ENV === "production"
        ? "https://excursion-backend.vercel.app"
        : "http://localhost:9000";
export async function getMembers(): Promise<MemberProps[]> {
    const response = await axios.get(`${baseURL}/api/v1/members`, {
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });
    const membersData: MemberProps[] = await response.data.data;

    return membersData;
}

export async function getReservations(): Promise<ReservationProps[]> {
    const response = await axios.get(`${baseURL}/api/v1/reservations`, {
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });
    const reservations: ReservationProps[] = await response.data.data;

    return reservations;
}

export async function getMemberById(id: string): Promise<MemberProps> {
    const endpoint = `${baseURL}/api/v1/members/${id}`;

    const response = await axios.get(endpoint, {
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });

    const memberData: MemberProps = response.data.data;

    return memberData;
}

export async function getGear(): Promise<GearProps[]> {
    const response = await axios.get(`${baseURL}/api/v1/gear`, {
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });
    const gearData: GearProps[] = await response.data.data;

    return gearData;
}

export async function getGearById(id: string): Promise<GearProps> {
    const response = await axios.get(`${baseURL}/api/v1/gear/${id}`, {
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });
    const gearData: GearProps = await response.data.data;

    return gearData;
}

export async function getReservationById(id: string): Promise<ReservationProps> {
    const response = await axios.get(`${baseURL}/api/v1/reservations/${id}`, {
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });
    const reservation: ReservationProps = await response.data.data;

    return reservation;
}

export async function updateGear(updatedGear: GearProps): Promise<GearProps> {
    const copiedGear = {...updatedGear};
    delete copiedGear.reservationDetails;
    delete copiedGear.memberDetails;

    // Use the _id property from the updatedGear object for the endpoint URL
    const url = `${baseURL}/api/v1/gear/${copiedGear._id}`;

    // Send the entire updatedGear object as the request payload
    const response = await axios.patch(url, copiedGear, {
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });

    // Assuming the updated gear data is returned in the response
    const newGear: GearProps = response.data.data;

    return newGear;
}

export async function updateMembers(updatedMember: MemberProps): Promise<MemberProps> {
    const copiedMember = {...updatedMember};

    const url = `${baseURL}/api/v1/members/${copiedMember._id}`;
    const response = await axios.patch(url, copiedMember, {
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });
    const newMember: MemberProps = response.data.data;
    return newMember;
}

export async function deleteGearItems(ids: string[]): Promise<number> {
    const response = await axios.delete(`${baseURL}/api/v1/gear/bulk-delete`, {
        data: {ids},
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });

    // Assuming the server returns the count of deleted items
    const deletedCount: number = response.data.data;

    return deletedCount;
}

export async function deleteMembers(ids: string[]): Promise<number> {
    const response = await axios.delete(`${baseURL}/api/v1/members/bulk-delete`, {
        data: {ids},
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });

    // Assuming the server returns the count of deleted items
    const deletedCount: number = response.data.data;

    return deletedCount;
}

export async function addGear(newGearData: NewGearProps): Promise<GearProps> {
    const response = await axios.post(`${baseURL}/api/v1/gear`, newGearData, {
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });
    return response.data.data;
}

export async function addMember(newMemberData: NewMemberProps): Promise<MemberProps> {
    const response = await axios.post(`${baseURL}/api/v1/members`, newMemberData, {
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });
    return response.data.data;
}

export async function getReservationsByIds(ids: string[]): Promise<ReservationProps[]> {
    const response = await axios.get(`${baseURL}/api/v1/reservations/by-ids`, {
        params: {
            ids: ids.join(",")
        },
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });
    return response.data.data;
}

export async function addReservation(
    newReservationData: NewReservationProps
): Promise<ReservationProps> {
    const response = await axios.post(`${baseURL}/api/v1/reservations`, newReservationData, {
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });
    return response.data.data;
}

export async function endReservations(reservationIds: string[]) {
    const response = await axios.put(
        `${baseURL}/api/v1/reservations/end`,
        {
            ids: reservationIds
        },
        {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        }
    );
    return response.data.data;
}

type DecodedJWTProps = {
    exp: number;
    iat: number;
    userId: string;
};

export const verifyAccessToken = async (accessToken: string): Promise<DecodedJWTProps | null> => {
    try {
        const response = await axios.post(`${baseURL}/api/v1/auth/google`, {
            access_token: accessToken // Send access_token to backend
        });

        const jwtToken = response.data.data;

        if (!jwtToken) return;

        const isSecure =
            process.env.NODE_ENV === "production" || window.location.protocol === "https:";

        new Cookies().set("jwt", jwtToken, {
            path: "/",
            secure: isSecure,
            sameSite: "strict"
        });

        const decodedJWT: DecodedJWTProps = parseJwt(jwtToken);

        return decodedJWT;
    } catch (error) {
        console.error("Error sending token to backend:", error);
        return null;
    }
};

export async function verifyJWTToken(jwt: string): Promise<string | null> {
    try {
        const response = await axios.post(`${baseURL}/api/v1/auth/verify`, {
            jwtToken: jwt // Send token to backend for verification
        });

        const userId = response.data.data;

        if (userId) {
            return userId;
        }
        return null;
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
}

export async function getStaff(): Promise<StaffProps[]> {
    const response = await axios.get(`${baseURL}/api/v1/staff`, {
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });

    const staffData: StaffProps[] = response.data.data;

    return staffData;
}

export async function getStaffById(staffId: string): Promise<StaffProps> {
    const endpoint = `${baseURL}/api/v1/staff/${staffId}`;

    const response = await axios.get(endpoint, {
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });

    const staffData: StaffProps = response.data.data;

    return staffData;
}

export async function getStaffByMemberID(memberID: string): Promise<StaffProps | null> {
    const endpoint = `${baseURL}/api/v1/staff/member/${memberID}`;

    const response = await axios.get(endpoint, {
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });

    const staffData: StaffProps = response.data.data;

    return staffData;
}

export async function updateStaff(updatedStaff: StaffProps): Promise<StaffProps> {
    const copiedStaff = {...updatedStaff};
    delete copiedStaff.memberDetails;

    console.log(copiedStaff); //test
    console.log("id:", copiedStaff._id); //test

    const url = `${baseURL}/api/v1/staff/${copiedStaff._id}`;

    const response = await axios.patch(url, copiedStaff, {
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });

    const staff: StaffProps = response.data.data;

    return staff;
}

export async function deleteStaff(ids: string[]): Promise<number> {
    const response = await axios.delete(`${baseURL}/api/v1/staff/bulk-delete`, {
        data: {ids},
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });

    // Assuming the server returns the count of deleted staff members
    const deletedCount: number = response.data.data;

    return deletedCount;
}

export async function addStaff(newStaffProps: NewStaffProps): Promise<StaffProps> {
    console.log("api call newStaffProps:", newStaffProps); //test
    const response = await axios.post(`${baseURL}/api/v1/staff`, newStaffProps, {
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });
    console.log(response.data.data);
    return response.data.data;
}
