// Snackbar.tsx

import React from "react";
import {useSnackbar} from "../providers/SnackBarProvider";
import SnackbarMUI from "@mui/material/Snackbar";
import MuiAlert, {AlertProps} from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

Alert.displayName = "Alert";

const Snackbar: React.FC = () => {
    const {notifications, removeNotification} = useSnackbar();

    const handleClose = (reason?: string, key?: number) => {
        if (reason === "clickaway") {
            return;
        }

        if (notifications.length > 0) {
            removeNotification(key || (notifications[notifications.length - 1].key as number));
        }
    };

    return (
        <>
            {notifications.map((notif) => (
                <SnackbarMUI
                    key={notif.key}
                    open={true}
                    autoHideDuration={4000}
                    onClose={(event, reason) => handleClose(reason, notif.key)}
                >
                    <Alert onClose={() => handleClose()} severity={notif.type || "info"}>
                        {notif.message}
                    </Alert>
                </SnackbarMUI>
            ))}
        </>
    );
};

export default Snackbar;
