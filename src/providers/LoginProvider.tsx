import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {verifyAccessToken, verifyJWTToken} from "src/utils/api";
import Cookies from "universal-cookie";

type LoginContextType = {
    isLoggedIn: boolean;
    isAdmin: boolean;
    userId: string | null;
    verifyJWT: () => Promise<boolean>;
    login: (accessToken: string) => Promise<void>;
    isFetching: boolean;
};

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export function LoginProvider({children}: {children: React.ReactNode}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const verifyJWT = useCallback(async () => {
        const jwt = new Cookies().get("jwt");
        if (jwt) {
            setIsFetching(true);
            const retrievedUserId = await verifyJWTToken(jwt);
            setIsFetching(false);
            if (retrievedUserId) {
                setUserId(retrievedUserId);
                setIsLoggedIn(true);
                return true;
            } else {
                new Cookies().remove("jwt");
            }
        }
        return false;
    }, []);

    useEffect(() => {
        verifyJWT();
    }, [verifyJWT]);

    const login = async (accessToken: string) => {
        setIsFetching(true);
        const decodedJWT = await verifyAccessToken(accessToken);
        setIsFetching(false);
        if (!decodedJWT.userId) return null;

        setUserId(decodedJWT.userId);
        setIsLoggedIn(true);
    };

    const isAdmin = true;

    return (
        <LoginContext.Provider value={{isLoggedIn, isAdmin, userId, verifyJWT, login, isFetching}}>
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
