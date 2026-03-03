import {IdentityProps} from "./types";
import {CommentCategory, TripProps, TripType} from "./types";

export function capitalizeFirstLetter(str: string) {
    return str
        .split(" ") // Split string by space
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of every word
        .join(" "); // Join the words back together
}

export function formatEnumLabel(value: string) {
    return value
        .split(/[\s_-]+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

export function formatCommentCategoryLabel(category: CommentCategory) {
    if (category === "warning") return "WARNING";
    return formatEnumLabel(category);
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
    const formattedMonth = month.length === 1 ? "0" + month : month;


    return `${year}-${formattedMonth}-${formattedDay}`;
}

export function isSameCalendarDay(startTimestamp: number, endTimestamp: number) {
    const start = new Date(startTimestamp);
    const end = new Date(endTimestamp);

    return (
        start.getFullYear() === end.getFullYear() &&
        start.getMonth() === end.getMonth() &&
        start.getDate() === end.getDate()
    );
}

export function getTripType(trip: Pick<TripProps, "trip_date" | "end_date">): TripType {
    if (!trip.end_date) return "day";
    return isSameCalendarDay(trip.trip_date, trip.end_date) ? "day" : "overnight";
}

export const generateResourceUrl = (resourcePath: string): string => {
    // If backend already returns a full URL (CloudFront or S3), use it as-is.
    if (resourcePath?.startsWith("http://") || resourcePath?.startsWith("https://")) {
        return resourcePath;
    }

    // Otherwise, prepend our CloudFront base to the path.
    return `${import.meta.env.EXC_CLOUDFRONT_BASE_URL}${resourcePath}`;
};
