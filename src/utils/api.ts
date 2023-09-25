import {
    GearProps,
    MemberProps,
    NewGearProps,
    NewReservationProps,
    ReservationProps,
    NewMemberProps
} from "./types";
import axios from "axios";

const baseURL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:9000"
        : "https://excursion-backend.vercel.app";

export async function getMembers(): Promise<MemberProps[]> {
    const response = await axios.get(`${baseURL}/api/v1/members`);
    const membersData: MemberProps[] = await response.data.data;

    return membersData;
}

export async function getReservations(): Promise<ReservationProps[]> {
    const response = await axios.get(`${baseURL}/api/v1/reservations`);
    const reservations: ReservationProps[] = await response.data.data;

    return reservations;
}

export async function getMemberById(memberId: string): Promise<MemberProps> {
    const endpoint = `${baseURL}/api/v1/members/${memberId}`;

    const response = await axios.get(endpoint);

    const memberData: MemberProps = response.data.data;

    return memberData;
}

export async function getGear(): Promise<GearProps[]> {
    const response = await axios.get(`${baseURL}/api/v1/gear`);
    const gearData: GearProps[] = await response.data.data;

    return gearData;
}

export async function getGearById(id: string): Promise<GearProps> {
    const response = await axios.get(`${baseURL}/api/v1/gear/${id}`);
    const gearData: GearProps = await response.data.data;

    return gearData;
}

export async function getReservationById(id: string): Promise<ReservationProps> {
    const response = await axios.get(`${baseURL}/api/v1/reservations/${id}`);
    const reservation: ReservationProps = await response.data.data;

    return reservation;
}

export async function updateGear(updatedGear: GearProps): Promise<GearProps> {
    // Use the _id property from the updatedGear object for the endpoint URL
    const url = `${baseURL}/api/v1/gear/${updatedGear._id}`;

    // Send the entire updatedGear object as the request payload
    const response = await axios.patch(url, updatedGear);

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
    const response = await axios.patch(url, updatedMember);
    const newMember: MemberProps = response.data.data;
    return newMember;
}

export async function deleteGearItems(ids: string[]): Promise<number> {
    const response = await axios.delete(`${baseURL}/api/v1/gear/bulk-delete`, {
        data: {ids}
    });

    // Assuming the server returns the count of deleted items
    const deletedCount: number = response.data.data;

    return deletedCount;
}

export async function deleteMembers(ids: string[]): Promise<number> {
    const response = await axios.delete(`${baseURL}/api/v1/members/bulk-delete`, {
        data: {ids}
    });

    // Assuming the server returns the count of deleted items
    const deletedCount: number = response.data.data;

    return deletedCount;
}

export async function addGear(newGearData: NewGearProps): Promise<GearProps> {
    const response = await axios.post(`${baseURL}/api/v1/gear`, newGearData);
    return response.data.data;
}

export async function addMember(newMemberData: NewMemberProps): Promise<MemberProps> {
    const response = await axios.post(`${baseURL}/api/v1/members`, newMemberData);
    return response.data.data;
}

export async function getReservationsByIds(ids: string[]): Promise<ReservationProps[]> {
    const response = await axios.get(`${baseURL}/api/v1/reservations/by-ids`, {
        params: {
            ids: ids.join(",")
        }
    });
    return response.data.data;
}

export async function addReservation(
    newReservationData: NewReservationProps
): Promise<ReservationProps> {
    const response = await axios.post(`${baseURL}/api/v1/reservations`, newReservationData);
    return response.data.data;
}

export async function endReservations(reservationIds: string[]) {
    const response = await axios.put(`${baseURL}/api/v1/reservations/end`, {
        ids: reservationIds
    });
    return response.data.data;
}
