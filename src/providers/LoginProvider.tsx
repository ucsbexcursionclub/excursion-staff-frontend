import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {verifyAccessToken, verifyJWTToken} from "src/utils/api";
import {IdentityProps} from "src/utils/types";
import Cookies from "universal-cookie";

type LoginContextType = {
    isLoggedIn: boolean;
    isAdmin: boolean;
    identity: IdentityProps | null;
    verifyJWT: () => Promise<boolean>;
    login: (accessToken: string) => Promise<void>;
    isFetching: boolean;
};

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export function LoginProvider({children}: {children: React.ReactNode}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [identity, setIdentity] = useState<IdentityProps | null>(null);

    const verifyJWT = useCallback(async () => {
        const jwt = new Cookies().get("jwt");
        if (jwt) {
            setIsFetching(true);
            const retrievedIdentity = await verifyJWTToken(jwt);
            setIsFetching(false);
            if (retrievedIdentity) {
                setIdentity(retrievedIdentity);
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
        const userIdentity = await verifyAccessToken(accessToken);
        setIsFetching(false);
        if (!userIdentity) return null;
        setIdentity(userIdentity);
        setIsLoggedIn(true);
    };

    const isAdmin = true;

    return (
        <LoginContext.Provider
            value={{isLoggedIn, isAdmin, identity, verifyJWT, login, isFetching}}
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
