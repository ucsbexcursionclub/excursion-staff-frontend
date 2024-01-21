import {createRoot} from "react-dom/client";
import {CssBaseline, ThemeProvider, createTheme} from "@mui/material";
import {BrowserRouter as Router} from "react-router-dom";
import {StyledEngineProvider} from "@mui/material/styles";
import {QueryClient, QueryClientProvider, QueryFunctionContext, QueryKey} from "react-query";
import {GoogleOAuthProvider} from "@react-oauth/google";

import React from "react";
import App from "./App";
import {getGearById, getMemberById, getReservationById, getStaffById} from "./utils/api";

import "./index.css";
import {LoginProvider} from "./providers/LoginProvider";
import {SnackbarProvider} from "./providers/SnackBarProvider";
import Snackbar from "./components/Snackbar";

const defaultQueryFunction = async ({queryKey}: QueryFunctionContext<QueryKey>) => {
    const [type, id] = queryKey as string[];

    if (type === "gearItem" && id) {
        console.log(`fetching gear ${id} from db`);
        return await getGearById(id);
    } else if (type === "memberItem" && id) {
        console.log(`fetching member ${id} from db`);
        return await getMemberById(id);
    } else if (type === "reservationItem" && id) {
        console.log(`fetching reservation ${id} from db`);
        return await getReservationById(id);
    } else if (type === "staffItem" && id) {
        console.log(`fetching staff ${id} from db`);
        return await getStaffById(id);
    }
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // default: true
            queryFn: defaultQueryFunction
        }
    }
});

const clientId = "385419886805-3c721tq7o5j7bb6c9t4bgdk23udhp9r6.apps.googleusercontent.com";

const container = document.getElementById("root");
const root = createRoot(container!);

const theme = createTheme({
    components: {
        MuiPopover: {
            defaultProps: {
                container: container
            }
        },
        MuiPopper: {
            defaultProps: {
                container: container
            }
        },
        MuiDialog: {
            defaultProps: {
                container: container
            }
        },
        MuiModal: {
            defaultProps: {
                container: container
            }
        }
    }
});

root.render(
    <GoogleOAuthProvider clientId={clientId}>
        <SnackbarProvider>
            <LoginProvider>
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <StyledEngineProvider injectFirst>
                            <ThemeProvider theme={theme}>
                                <CssBaseline>
                                    <App />
                                </CssBaseline>
                            </ThemeProvider>
                        </StyledEngineProvider>
                    </Router>
                </QueryClientProvider>
            </LoginProvider>
            <Snackbar />
        </SnackbarProvider>
    </GoogleOAuthProvider>
);
