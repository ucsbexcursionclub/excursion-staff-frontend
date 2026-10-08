import Cookies from "universal-cookie";

const JWT_COOKIE = "jwt";
const cookies = new Cookies();

export const SESSION_EXPIRED_MESSAGE = "Your session expired, please log in again.";

export class SessionExpiredError extends Error {
    constructor(message: string = SESSION_EXPIRED_MESSAGE) {
        super(message);
        this.name = "SessionExpiredError";
    }
}

/** A JWT is a non-empty string of three non-empty, dot-separated parts. */
export const isValidJwtFormat = (token: unknown): token is string => {
    if (typeof token !== "string") return false;
    const trimmed = token.trim();
    if (!trimmed || trimmed === "undefined" || trimmed === "null") return false;
    const parts = trimmed.split(".");
    return parts.length === 3 && parts.every((part) => part.length > 0);
};

export const clearStoredToken = () => {
    cookies.remove(JWT_COOKIE, {path: "/"});
};

/** Returns the stored token, or null (and discards the cookie) if it is missing or malformed. */
export const getStoredToken = (): string | null => {
    const token = cookies.get(JWT_COOKIE, {doNotParse: true});
    if (isValidJwtFormat(token)) return token;
    if (token !== undefined) clearStoredToken();
    return null;
};

export const setStoredToken = (token: unknown) => {
    if (!isValidJwtFormat(token)) {
        throw new Error("Server returned an invalid session token. Please log in again.");
    }
    const isSecure = import.meta.env.PROD || window.location.protocol === "https:";
    cookies.set(JWT_COOKIE, token, {path: "/", secure: isSecure, sameSite: "strict"});
};

type SessionExpiredListener = () => void;
const listeners = new Set<SessionExpiredListener>();

export const onSessionExpired = (listener: SessionExpiredListener) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

/** Clears the token and tells the app to log out. */
export const expireSession = () => {
    clearStoredToken();
    listeners.forEach((listener) => listener());
};
