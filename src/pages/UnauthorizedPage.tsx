import React from "react";
import {Link as RouterLink} from "react-router-dom";
import {Button, Typography, Container, Box, CircularProgress} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import GoogleIcon from "@mui/icons-material/Google";
import {useGoogleLogin} from "@react-oauth/google";
import {useLogin} from "../providers/LoginProvider";

const UnauthorizedPage = () => {
    const {isLoggedIn, isFetching, sessionExpired, sessionError, login} = useLogin();

    // Staying on the same URL means the original page comes back after re-login
    const handleLogin = useGoogleLogin({
        onSuccess: (tokenResponse) => login(tokenResponse.access_token)
    });

    if (isFetching) {
        return (
            <Container className="h-screen flex justify-center items-center">
                <CircularProgress />
            </Container>
        );
    }

    const title = sessionExpired
        ? "Session Expired"
        : sessionError
          ? "Couldn't Verify Session"
          : isLoggedIn
            ? "Unauthorized Access"
            : "Please Log In";
    const message = sessionExpired
        ? "Your session expired, please log in again."
        : sessionError
          ? sessionError
          : isLoggedIn
            ? "You don't have permission to access this page."
            : "Log in with your staff Google account to access this page.";

    return (
        <Container className="h-screen flex flex-col justify-center items-center bg-gray-100">
            <Box className="p-6 bg-white rounded shadow-md text-center space-y-4">
                <ErrorOutlineIcon fontSize="large" color="error" />
                <Typography variant="h5" color="textSecondary">
                    {title}
                </Typography>
                <Typography variant="body1">{message}</Typography>
                <Box className="flex justify-center gap-2">
                    {!isLoggedIn && (
                        <Button
                            variant="contained"
                            startIcon={<GoogleIcon />}
                            onClick={() => handleLogin()}
                        >
                            Log In
                        </Button>
                    )}
                    <Button variant="outlined" color="inherit" component={RouterLink} to="/">
                        Return to Home
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default UnauthorizedPage;
