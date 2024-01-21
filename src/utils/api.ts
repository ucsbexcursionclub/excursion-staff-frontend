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
    ? "https://excursion-backend-three.vercel.app"
    : "http://localhost:9000";

function handleApiErrors(item: string, error: any): void {
    if (error.response) {
        switch (error.response.status) {
            case 403:
                throw new Error(`You don't have permission to interact with ${item} data.`);
            case 404:
                throw new Error(`No ${item} data found.`);
            case 500:
                throw new Error("Internal server error. Please try again later.");
            case 400:
                throw new Error("Invalid Credentials.");
            default:
                throw new Error("An unexpected error occurred. Please try again.");
        }
    } else {
        if (error.message) {
            throw error;
        } else {
            throw new Error(`Failed to interact with ${item} data.`);
        }
    }
}

export async function getMembers(): Promise<MemberProps[]> {
    try {
        const response = await axios.get(`${baseURL}/api/v1/members`, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            throw new Error("No members data received from the server.");
        }
    } catch (error: any) {
        handleApiErrors("member", error);
        throw new Error("An unexpected error occurred in getMembers."); // never gets triggered, here for type safety
    }
}

export async function getMemberById(id: string): Promise<MemberProps> {
    try {
        const response = await axios.get(`${baseURL}/api/v1/members/${id}`, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            // Throw an error if the response data is not as expected
            throw new Error("Error while refetching member data.");
        }
    } catch (error: any) {
        console.error("Error fetching member by ID:", error);
        throw error;
    }
}

export async function getReservations(): Promise<ReservationProps[]> {
    try {
        const response = await axios.get(`${baseURL}/api/v1/reservations`, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            throw new Error("No reservations data received from the server.");
        }
    } catch (error: any) {
        handleApiErrors("reservation", error);
        throw new Error("An unexpected error occurred in getReservations."); // never gets triggered, here for type safety
    }
}

export async function getGear(): Promise<GearProps[]> {
    try {
        const response = await axios.get(`${baseURL}/api/v1/gear`, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            throw new Error("No gear data received from the server.");
        }
    } catch (error: any) {
        handleApiErrors("gear", error);
        throw new Error("An unexpected error occurred in getGear."); // never gets triggered, here for type safety
    }
}

export async function getGearById(id: string): Promise<GearProps> {
    try {
        const response = await axios.get(`${baseURL}/api/v1/gear/${id}`, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            return response.data.data as GearProps;
        } else {
            throw new Error("Error while fetching gear data.");
        }
    } catch (error: any) {
        console.error("Error fetching gear by ID:", error);
        throw error;
    }
}

export async function getReservationById(id: string): Promise<ReservationProps> {
    try {
        const response = await axios.get(`${baseURL}/api/v1/reservations/${id}`, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            return response.data.data as ReservationProps;
        } else {
            throw new Error("Error while fetching reservation data.");
        }
    } catch (error: any) {
        console.error("Error fetching reservation by ID:", error);
        throw error;
    }
}

export async function updateGear(updatedGear: GearProps): Promise<GearProps> {
    const copiedGear = {...updatedGear};
    delete copiedGear.reservationDetails;
    delete copiedGear.memberDetails;

    const url = `${baseURL}/api/v1/gear/${copiedGear._id}`;

    try {
        const response = await axios.patch(url, copiedGear, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            // Handle the case where the response does not have the expected data format
            throw new Error();
        }
    } catch (error: any) {
        // Rethrow the error to be handled by the caller
        throw new Error(error.response?.data?.error || "Failed to update gear.");
    }
}

export async function updateReservation(
    updatedReservation: ReservationProps
): Promise<ReservationProps> {
    const copiedReservation = {...updatedReservation};
    delete copiedReservation.memberDetails;

    const url = `${baseURL}/api/v1/reservations/${copiedReservation._id}`;

    try {
        const response = await axios.patch(url, copiedReservation, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            throw new Error();
        }
    } catch (error: any) {
        // Rethrow the error with a meaningful message, possibly including server-provided error information
        throw new Error(error.response?.data?.error || "Failed to update reservation.");
    }
}

export async function updateMember(updatedMember: MemberProps): Promise<MemberProps> {
    const copiedMember = {...updatedMember};

    const url = `${baseURL}/api/v1/members/${copiedMember._id}`;

    try {
        const response = await axios.patch(url, copiedMember, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            throw new Error();
        }
    } catch (error: any) {
        // Rethrow the error with a meaningful message, possibly including server-provided error information
        throw new Error(error.response?.data?.error || "Failed to update member.");
    }
}

export async function deleteGearItems(ids: string[]): Promise<number> {
    try {
        const response = await axios.delete(`${baseURL}/api/v1/gear/bulk-delete`, {
            data: {ids},
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            const deletedCount: number = response.data.data;
            return deletedCount;
        } else {
            throw new Error("No gear data received from the server.");
        }
    } catch (error: any) {
        handleApiErrors("gear", error);
        throw new Error("An unexpected error occurred in deleteGearItems.");
    }
}

export async function deleteMembers(ids: string[]): Promise<number> {
    try {
        const response = await axios.delete(`${baseURL}/api/v1/members/bulk-delete`, {
            data: {ids},
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            const deletedCount: number = response.data.data;
            return deletedCount;
        } else {
            throw new Error("No gear data received from the server.");
        }
    } catch (error: any) {
        handleApiErrors("member", error);
        throw new Error("An unexpected error occurred in deleteMembers."); // never gets triggered, here for type safety
    }
}

export async function addGear(newGearData: NewGearProps): Promise<GearProps> {
    try {
        const response = await axios.post(`${baseURL}/api/v1/gear`, newGearData, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            throw new Error("Gear data not received from the server.");
        }
    } catch (error: any) {
        handleApiErrors("gear", error);
        throw new Error("An unexpected error occurred while adding gear.");
    }
}

export async function addMember(newMemberData: NewMemberProps): Promise<MemberProps> {
    try {
        const response = await axios.post(`${baseURL}/api/v1/members`, newMemberData, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            const addedMember: MemberProps = response.data.data;

            try {
                await sendWelcomeEmail(addedMember.email);
            } catch (error: any) {
                console.error("Error sending welcome email:", error.message);
            }

            return addedMember;
        } else {
            throw new Error("Member data not received from the server.");
        }
    } catch (error: any) {
        handleApiErrors("member", error);
        throw new Error("An unexpected error occured.");
    }
}

export async function addReservation(
    newReservationData: NewReservationProps
): Promise<ReservationProps> {
    try {
        const response = await axios.post(`${baseURL}/api/v1/reservations`, newReservationData, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            throw new Error("Reservation data not received from the server.");
        }
    } catch (error: any) {
        handleApiErrors("reservation", error);
        throw new Error("An unexpected error occurred while adding reservation.");
    }
}

export async function checkInGear(gearIds: string[]): Promise<boolean> {
    try {
        const response = await axios.put(
            `${baseURL}/api/v1/gear/checkIn`,
            {
                ids: gearIds
            },
            {
                headers: {
                    Authorization: `Bearer ${cookies.get("jwt")}`
                }
            }
        );

        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            throw new Error("Server error while checking in gear");
        }
    } catch (error: any) {
        handleApiErrors("gear", error);
        throw new Error("An unexpected error occurred while checking in gear");
    }
}

export const verifyAccessToken = async (accessToken: string): Promise<IdentityProps> => {
    try {
        const response = await axios.post(`${baseURL}/api/v1/auth/google`, {
            access_token: accessToken
        });

        const jwtToken = response.data.data;

        if (!jwtToken) {
            throw new Error("No Token Returned from Server.");
        }

        const decodedJWT: any = parseJwt(jwtToken);

        if (isIdentityProps(decodedJWT)) {
            if ((decodedJWT as IdentityProps).role === "user") {
                throw new Error("Invalid Permissions");
            }

            const isSecure = import.meta.env.PROD || window.location.protocol === "https:";

            new Cookies().set("jwt", jwtToken, {
                path: "/",
                secure: isSecure,
                sameSite: "strict"
            });

            return decodedJWT;
        } else {
            throw new Error("Invalid Token Response");
        }
    } catch (error: any) {
        handleApiErrors("authentication", error);
        throw new Error("Unexpected error occured while verifying access token");
    }
};

export const uploadFileToS3 = async (uploadedFile: File): Promise<string> => {
    const formData = new FormData();
    formData.append("profilePic", uploadedFile);

    try {
        const response = await axios.post(`${baseURL}/api/v1/upload`, formData, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });
        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            throw new Error("Server error while uploading file.");
        }
    } catch (error: any) {
        handleApiErrors("file_upload", error);
        throw new Error("Failed to upload image to server");
    }
};

export async function verifyJWTToken(jwt: string): Promise<IdentityProps> {
    try {
        const response = await axios.post(`${baseURL}/api/v1/auth/verify`, {
            jwtToken: jwt // Send token to backend for verification
        });

        const jwtToken = response.data.data;

        if (!jwtToken) {
            throw new Error("No token response from server.");
        }

        const isSecure = import.meta.env.PROD || window.location.protocol === "https:";

        new Cookies().set("jwt", jwtToken, {
            path: "/",
            secure: isSecure,
            sameSite: "strict"
        });

        const decodedJWT: any = parseJwt(jwtToken);

        if (isIdentityProps(decodedJWT)) {
            if ((decodedJWT as IdentityProps).role === "user") {
                throw new Error("Invalid Permissions");
            }
            return decodedJWT;
        } else {
            throw new Error("Invalid Token Response");
        }
    } catch (error: any) {
        handleApiErrors("authentication", error);
        throw new Error("Unexpected error occured while verifying JWT token");
    }
}

export async function getStaff(): Promise<StaffProps[]> {
    try {
        const response = await axios.get(`${baseURL}/api/v1/staff`, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            throw new Error("No staff data received from the server.");
        }
    } catch (error: any) {
        handleApiErrors("staff", error);
        throw new Error("An unexpected error occurred in getStaff."); // never gets triggered, here for type safety
    }
}

export async function getStaffProfiles(): Promise<StaffProfile[]> {
    try {
        const response = await axios.get(`${baseURL}/api/v1/staff_protected`);

        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            throw new Error("No staff profile data received from the server.");
        }
    } catch (error: any) {
        handleApiErrors("staff_profiles", error);
        throw new Error("An unexpected error occurred in getting staff profiles."); // never gets triggered, here for type safety
    }
}

export async function getStaffById(staffId: string): Promise<StaffProps> {
    try {
        const response = await axios.get(`${baseURL}/api/v1/staff/${staffId}`, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            return response.data.data as StaffProps;
        } else {
            throw new Error("Error while fetching staff data.");
        }
    } catch (error: any) {
        console.error("Error fetching staff by ID:", error);
        throw error;
    }
}

export async function updateStaff(updatedStaff: StaffProps): Promise<StaffProps> {
    const copiedStaff = {...updatedStaff};
    delete copiedStaff.memberDetails; // Assuming this is an unwanted property in the request

    const url = `${baseURL}/api/v1/staff/${copiedStaff._id}`;

    try {
        const response = await axios.patch(url, copiedStaff, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            throw new Error();
        }
    } catch (error: any) {
        // Rethrow the error with a meaningful message, possibly including server-provided error information
        throw new Error(error.response?.data?.error || "Failed to update staff.");
    }
}

export async function deleteStaff(ids: string[]): Promise<number> {
    try {
        const response = await axios.delete(`${baseURL}/api/v1/staff/bulk-delete`, {
            data: {ids},
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            const deletedCount: number = response.data.data;
            return deletedCount;
        } else {
            throw new Error("No staff data received from the server.");
        }
    } catch (error: any) {
        handleApiErrors("staff", error);
        throw new Error("An unexpected error occurred in deleteStaff.");
    }
}

export async function addStaff(newStaffProps: NewStaffProps): Promise<StaffProps> {
    try {
        const response = await axios.post(`${baseURL}/api/v1/staff`, newStaffProps, {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            throw new Error("Staff data not received from the server.");
        }
    } catch (error: any) {
        handleApiErrors("staff", error);
        throw new Error("An unexpected error occurred while adding staff.");
    }
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
    } catch (error: any) {
        throw new Error("Server error while sending feedback.");
    }
}

async function sendWelcomeEmail(email: string): Promise<void> {
    try {
        // Customize this part to send a welcome email to the provided email address
        // You can use axios.post or any other method suitable for your API
        console.log(`Sending welcome email to ${email}...`);
        await axios.post(`${baseURL}/api/v1/mail/send-welcome-email`, {email});
        console.log(`Welcome email sent successfully to ${email}!`);
    } catch (error: any) {
        console.error(`Error sending welcome email to ${email}:`, error);
    }
}
