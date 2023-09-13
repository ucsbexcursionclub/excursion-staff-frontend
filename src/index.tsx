import {createRoot} from "react-dom/client";
import {CssBaseline} from "@mui/material";
import {BrowserRouter as Router} from "react-router-dom";
import {StyledEngineProvider} from "@mui/material/styles";
import {QueryClient, QueryClientProvider} from "react-query";

import "./index.css";

const queryClient = new QueryClient();

import React from "react";
import App from "./App";
const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
    <QueryClientProvider client={queryClient}>
        <Router>
            <StyledEngineProvider injectFirst>
                <CssBaseline>
                    <App />
                </CssBaseline>
            </StyledEngineProvider>
        </Router>
    </QueryClientProvider>
);
