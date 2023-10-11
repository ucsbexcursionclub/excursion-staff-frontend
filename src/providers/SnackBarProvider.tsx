import React, {createContext, useContext, ReactNode, useState} from "react";
import {NotificationProps} from "../utils/types";

interface SnackbarContextType {
    notifications: NotificationProps[];
    addNotification: (notif: NotificationProps) => void;
    removeNotification: (key: number) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

interface SnackbarProviderProps {
    children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({children}) => {
    const [notifications, setNotifications] = useState<NotificationProps[]>([]);

    const addNotification = (notif: NotificationProps) => {
        setNotifications((prev) => [...prev, {...notif, key: Math.random() * Date.now()}]);
    };

    const removeNotification = (key: number) => {
        setNotifications((prev) => prev.filter((notif) => notif.key !== key));
    };

    return (
        <SnackbarContext.Provider value={{notifications, addNotification, removeNotification}}>
            {children}
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = (): SnackbarContextType => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error("useSnackbar must be used within a SnackbarProvider");
    }
    return context;
};
