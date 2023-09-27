import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {verifyAccessToken, verifyJWTToken} from "src/utils/api";
import {MemberProps} from "src/utils/types";
import Cookies from "universal-cookie";

type LoginContextType = {
    isLoggedIn: boolean;
    user: MemberProps | null;
    verifyJWT: () => Promise<boolean>;
    login: (accessToken: string) => Promise<void>;
    isFetching: boolean;
};

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export function LoginProvider({children}: {children: React.ReactNode}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [user, setUser] = useState<MemberProps | null>(null);

    const verifyJWT = useCallback(async () => {
        const jwt = new Cookies().get("jwt");
        if (jwt) {
            setIsFetching(true);
            const data = await verifyJWTToken(jwt);
            setIsFetching(false);
            if (data && data.user) {
                setUser(data.user);
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
        const data = await verifyAccessToken(accessToken);
        setIsFetching(false);
        if (!data) return;

        setUser(data.user);
        setIsLoggedIn(true);

        const isSecure =
            process.env.NODE_ENV === "production" || window.location.protocol === "https:";

        new Cookies().set("jwt", data.jwt, {
            path: "/",
            secure: isSecure,
            sameSite: "strict"
        });
    };

    return (
        <LoginContext.Provider value={{isLoggedIn, user, verifyJWT, login, isFetching}}>
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
