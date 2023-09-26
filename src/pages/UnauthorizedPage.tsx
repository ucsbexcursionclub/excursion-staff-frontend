import React from "react";
import {Link as RouterLink} from "react-router-dom";
import {Button, Typography, Container, Box} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const UnauthorizedPage = () => {
    return (
        <Container className="h-screen flex flex-col justify-center items-center bg-gray-100">
            <Box className="p-6 bg-white rounded shadow-md text-center space-y-4">
                <ErrorOutlineIcon fontSize="large" color="error" />
                <Typography variant="h5" color="textSecondary">
                    Unauthorized Access
                </Typography>
                <Typography variant="body1">
                    {`You don't have permission to access this page.`}
                </Typography>
                <Button variant="outlined" color="inherit" component={RouterLink} to="/">
                    Return to Home
                </Button>
            </Box>
        </Container>
    );
};

export default UnauthorizedPage;
