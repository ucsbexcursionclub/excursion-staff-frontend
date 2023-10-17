import {
    GearProps,
    MemberProps,
    NewGearProps,
    NewReservationProps,
    ReservationProps,
    NewMemberProps,
    StaffProps,
    NewStaffProps,
    IdentityProps,
    StaffProfile
} from "./types";
import axios from "axios";

import Cookies from "universal-cookie";
import {isIdentityProps, parseJwt} from "./utils";
const cookies = new Cookies();

const baseURL = import.meta.env.PROD
    ? "https://excursion-backend.vercel.app"
    : "http://localhost:9000";

export async function getMembers(): Promise<MemberProps[] | undefined> {
    try {
        const response = await axios.get(`${baseURL}/api/v1/members`, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            return response.data.data;
        }
    } catch (error: any) {
        // You can log the error if you want to diagnose issues.
        //console.error("Error fetching members:", error);

        if (error.response && error.response.status === 403) {
            throw new Error("You don't have permission to view member data.");
        } else {
            throw new Error("Failed to fetch members. Please try again later.");
        }
    }
}

export async function getMemberById(id: string): Promise<MemberProps | undefined> {
    try {
        const response = await axios.get(`${baseURL}/api/v1/members/${id}`, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            return response.data.data;
        }
    } catch (error) {
        // You can log the error if you want to diagnose issues.
        //console.error("Error fetching members:", error);

        return;
    }
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
    try {
        const copiedMember = {...updatedMember};

        const url = `${baseURL}/api/v1/members/${copiedMember._id}`;
        const response = await axios.patch(url, copiedMember, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });
        const newMember: MemberProps | null = response.data.data;
        if (newMember) {
            return newMember;
        } else {
            throw new Error();
        }
    } catch (error: any) {
        throw new Error("Error updating member details. Try again later.");
    }
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

export async function addMember(newMemberData: NewMemberProps): Promise<MemberProps | null> {
    const response = await axios.post(`${baseURL}/api/v1/members`, newMemberData, {
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });
    // Check if the response has a success message or other conditions before returning data
    if (response.data.data) {
        const addedMember: MemberProps = response.data.data;
        try {
            await sendWelcomeEmail(addedMember.email);
        } catch (error: any) {
            console.error("Error sending welcome email:", error.message);
        }

        return addedMember;
    } else {
        console.error("Error adding member:", response.data.status);
        return null;
    }
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

export const verifyAccessToken = async (accessToken: string): Promise<IdentityProps | null> => {
    try {
        const response = await axios.post(`${baseURL}/api/v1/auth/google`, {
            access_token: accessToken // Send access_token to backend
        });

        const jwtToken = response.data.data;

        if (!jwtToken) return null;

        const isSecure = import.meta.env.PROD || window.location.protocol === "https:";

        new Cookies().set("jwt", jwtToken, {
            path: "/",
            secure: isSecure,
            sameSite: "strict"
        });

        const decodedJWT: any = parseJwt(jwtToken);

        if (isIdentityProps(decodedJWT)) {
            return decodedJWT;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error sending token to backend:", error);
        return null;
    }
};

export const uploadFileToS3 = async (uploadedFile: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("profilePic", uploadedFile);

    try {
        const response = await axios.post(`${baseURL}/api/v1/upload`, formData, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });
        return response.data.data as string | null;
    } catch (error) {
        throw new Error("Failed to upload image to server");
    }
};

export async function verifyJWTToken(jwt: string): Promise<IdentityProps | null> {
    try {
        const response = await axios.post(`${baseURL}/api/v1/auth/verify`, {
            jwtToken: jwt // Send token to backend for verification
        });

        const jwtToken = response.data.data;

        if (!jwtToken) return null;

        const isSecure = import.meta.env.PROD || window.location.protocol === "https:";

        new Cookies().set("jwt", jwtToken, {
            path: "/",
            secure: isSecure,
            sameSite: "strict"
        });

        const decodedJWT: any = parseJwt(jwtToken);

        if (isIdentityProps(decodedJWT)) {
            return decodedJWT;
        } else {
            return null;
        }
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

export async function getStaffProfiles(): Promise<StaffProfile[]> {
    const response = await axios.get(`${baseURL}/api/v1/staff_protected`);

    const staffProfiles: StaffProfile[] = response.data.data;

    return staffProfiles;
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

export async function updateStaff(updatedStaff: StaffProps): Promise<StaffProps> {
    try {
        const copiedStaff = {...updatedStaff};
        delete copiedStaff.memberDetails;

        const url = `${baseURL}/api/v1/staff/${copiedStaff._id}`;

        const response = await axios.patch(url, copiedStaff, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        const staff: StaffProps | null = response.data.data;

        if (staff) {
            return staff;
        } else {
            throw new Error();
        }
    } catch (error: any) {
        throw new Error("Error updating member details. Try again later.");
    }
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
    const response = await axios.post(`${baseURL}/api/v1/staff`, newStaffProps, {
        headers: {
            Authorization: `Bearer ${cookies.get("jwt")}`
        }
    });
    return response.data.data;
}

export async function updateRole(member_id: string, newRole: IdentityProps["role"]): Promise<void> {
    const response = await axios.patch(
        `${baseURL}/api/v1/auth`,
        {member_id, newRole},
        {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        }
    );
    return response.data.data;
}

interface FeedbackProps {
    name: string;
    email: string;
    phone: string;
    subject: string;
    feedback: string;
}

export async function sendFeedback(feedbackData: FeedbackProps): Promise<void> {
    console.log(feedbackData);
    try {
        await axios.post(`${baseURL}/api/v1/mail/send-feedback`, feedbackData);
        console.log("Feedback data sent successfully to the backend!");
    } catch (error) {
        console.error("Error sending feedback data to the backend:", error);
    }
}

async function sendWelcomeEmail(email: string): Promise<void> {
    try {
        // Customize this part to send a welcome email to the provided email address
        // You can use axios.post or any other method suitable for your API
        console.log(`Sending welcome email to ${email}...`);
        await axios.post(`${baseURL}/api/v1/mail/send-welcome-email`, {email});
        console.log(`Welcome email sent successfully to ${email}!`);
    } catch (error) {
        console.error(`Error sending welcome email to ${email}:`, error);
    }
}
