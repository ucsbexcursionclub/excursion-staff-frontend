import {IdentityProps} from "./types";

export function capitalizeFirstLetter(str: string) {
    return str
        .split(" ") // Split string by space
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of every word
        .join(" "); // Join the words back together
}

export function parseJwt(token: string) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );

    return JSON.parse(jsonPayload);
}

export function isIdentityProps(obj: any): obj is IdentityProps {
    return (
        obj &&
        typeof obj.member_id === "string" &&
        typeof obj._id === "string" &&
        (obj.role === "user" || obj.role === "staff" || obj.role === "admin")
    );
}

export function convertToMUIDate(datetime: number): string {
    const [month, day, year] = new Date(datetime).toLocaleDateString().split("/");

    const formattedDay = day.length === 1 ? "0" + day : day;

    return `${year}-${month}-${formattedDay}`;
}

export const generateResourceUrl = (resourcePath: string): string =>
    `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}${resourcePath}`;
