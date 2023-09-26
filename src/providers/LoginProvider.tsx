import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {verifyAccessToken, verifyJWTToken} from "src/utils/api";
import Cookies from "universal-cookie";

const LoginContext = createContext(undefined);

export function LoginProvider({children}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const verifyJWT = useCallback(async () => {
        const jwt = new Cookies().get("jwt");
        if (jwt) {
            const data = await verifyJWTToken(jwt); // This function should make an API call to verify the token.
            console.log(data);
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
        const data = await verifyAccessToken(accessToken);

        if (!data) return;

        setUser(data.user);
        setIsLoggedIn(true);

        const isSecure =
            process.env.NODE_ENV === "production" || window.location.protocol === "https:";

        //secure this later httpOnly
        new Cookies().set("jwt", data.jwt, {
            path: "/",
            secure: isSecure,
            sameSite: "strict"
        });
    };

    return (
        <LoginContext.Provider value={{isLoggedIn, user, verifyJWT, login}}>
            {children}
        </LoginContext.Provider>
    );
}

export function useLogin() {
    const context = useContext(LoginContext);
    if (context === undefined) {
        throw new Error("useLogin must be used within a LoginProvider");
    }
    return context;
}
