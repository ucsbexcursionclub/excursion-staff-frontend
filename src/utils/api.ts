import {
    GearProps,
    MemberProps,
    NewGearProps,
    NewReservationProps,
    ReservationProps,
    NewMemberProps
} from "./types";
import axios from "axios";

import Cookies from "universal-cookie";
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

export async function getMemberById(memberId: string): Promise<MemberProps> {
    const endpoint = `${baseURL}/api/v1/members/${memberId}`;

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
    // Use the _id property from the updatedGear object for the endpoint URL
    const url = `${baseURL}/api/v1/gear/${updatedGear._id}`;

    // Send the entire updatedGear object as the request payload
    const response = await axios.patch(url, updatedGear, {
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });

    // Assuming the updated gear data is returned in the response
    const newGear: GearProps = response.data.data;

    return newGear;
}

export async function updateMembers(updatedMember: MemberProps): Promise<MemberProps> {
    // Determine whether it's a MemberProps or NewMemberProps
    if (~("_id" in updatedMember)) {
        // stub!
    }
    const url = `${baseURL}/api/v1/members/${updatedMember._id}`;
    const response = await axios.patch(url, updatedMember, {
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

export const verifyAccessToken = async (
    accessToken: string
): Promise<{jwt: string; user: MemberProps} | null> => {
    try {
        const response = await axios.post(`${baseURL}/api/v1/auth/google`, {
            access_token: accessToken // Send access_token to backend
        });

        if (response.data && response.data.jwt && response.data.user) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Error sending token to backend:", error);
        return null;
    }
};

export async function verifyJWTToken(jwt: string): Promise<{user: MemberProps} | null> {
    try {
        const response = await axios.post(`${baseURL}/api/v1/auth/verify`, {
            token: jwt // Send token to backend for verification
        });

        if (response.data && response.data.user) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
}
