import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {verifyAccessToken, verifyJWTToken} from "../utils/api";
import {IdentityProps} from "../utils/types";
import {useSnackbar} from "./SnackBarProvider";
import {
    expireSession,
    getStoredToken,
    onSessionExpired,
    SESSION_EXPIRED_MESSAGE,
    SessionExpiredError
} from "../utils/auth";

type LoginContextType = {
    isLoggedIn: boolean;
    isAdmin: boolean;
    isStaff: boolean;
    identity: IdentityProps | null;
    verifyJWT: () => Promise<boolean>;
    checkSession: () => Promise<void>;
    login: (accessToken: string) => Promise<void>;
    isFetching: boolean;
    sessionExpired: boolean;
    sessionError: string | null;
};

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export function LoginProvider({children}: {children: React.ReactNode}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [identity, setIdentity] = useState<IdentityProps | null>(null);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [sessionError, setSessionError] = useState<string | null>(null);
    // Many requests can 401 at once; only notify once per expiry
    const expiryNotifiedRef = useRef(false);
    // Only announce "session expired" if there actually was a session
    const hadSessionRef = useRef(false);

    const {addNotification} = useSnackbar();

    const isStaff = !!identity && ["admin", "staff"].includes(identity.role);
    const isAdmin = identity?.role === "admin";

    useEffect(
        () =>
            onSessionExpired(() => {
                setIdentity(null);
                setIsLoggedIn(false);
                setIsFetching(false);
                if (!hadSessionRef.current) return;
                setSessionExpired(true);
                if (!expiryNotifiedRef.current) {
                    expiryNotifiedRef.current = true;
                    addNotification({type: "error", message: SESSION_EXPIRED_MESSAGE});
                }
            }),
        [addNotification]
    );

    const verifyJWT = useCallback(async () => {
        const jwt = getStoredToken();
        if (!jwt) return false;

        hadSessionRef.current = true;
        setIsFetching(true);
        setSessionError(null);
        try {
            const retrievedIdentity = await verifyJWTToken(jwt);
            setIdentity(retrievedIdentity);
            setIsLoggedIn(true);
            return true;
        } catch (error: any) {
            // 401s are handled by the session-expired listener (logs out + notifies).
            // Anything else (5xx, network) must not be ignored: stay logged out and say why.
            if (!(error instanceof SessionExpiredError)) {
                setSessionError(error.message);
                addNotification({type: "error", message: error.message});
            }
            return false;
        } finally {
            setIsFetching(false);
        }
    }, [addNotification]);

    // Verify the stored session once on app load
    const verifyJWTRef = useRef(verifyJWT);
    useEffect(() => {
        verifyJWTRef.current();
    }, []);

    /** Confirms the session is still valid with the backend; throws if it isn't. */
    const checkSession = useCallback(async () => {
        const jwt = getStoredToken();
        if (!jwt) {
            expireSession();
            throw new SessionExpiredError();
        }
        const retrievedIdentity = await verifyJWTToken(jwt);
        setIdentity(retrievedIdentity);
        setIsLoggedIn(true);
    }, []);

    const login = async (accessToken: string): Promise<void> => {
        setIsFetching(true);
        try {
            const userIdentity = await verifyAccessToken(accessToken);
            setIdentity(userIdentity);
            setIsLoggedIn(true);
            hadSessionRef.current = true;
            setSessionExpired(false);
            setSessionError(null);
            expiryNotifiedRef.current = false;
        } catch (error: any) {
            addNotification({type: "error", message: error.message});
        }
        setIsFetching(false);
    };

    return (
        <LoginContext.Provider
            value={{
                isLoggedIn,
                isAdmin,
                isStaff,
                identity,
                verifyJWT,
                checkSession,
                login,
                isFetching,
                sessionExpired,
                sessionError
            }}
        >
            {children}
        </LoginContext.Provider>
    );
}

export function useLogin(): LoginContextType {
    const context = useContext(LoginContext);
    if (context === undefined) {
        throw new Error("useLogin must be used within a LoginProvider");
    }
    return context;
}
