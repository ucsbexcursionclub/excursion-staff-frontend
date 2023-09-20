import {createRoot} from "react-dom/client";
import {CssBaseline} from "@mui/material";
import {BrowserRouter as Router} from "react-router-dom";
import {StyledEngineProvider} from "@mui/material/styles";
import {QueryClient, QueryClientProvider} from "react-query";

import "./index.css";

const defaultQueryFunction = async ({queryKey}) => {
    const [type, id] = queryKey;

    if (type === "gearItem" && id) {
        console.log(`fetching gear ${id} from db`);
        return await getGearById(id);
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

import React from "react";
import App from "./App";
import {getGearById} from "./utils/api";
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
