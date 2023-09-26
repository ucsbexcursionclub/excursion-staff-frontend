import React from "react";
import {useGoogleLogin, TokenResponse} from "@react-oauth/google";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import GoogleIcon from "@mui/icons-material/Google";
import Avatar from "@mui/material/Avatar";
import Logout from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Cookies from "universal-cookie";
import {CircularProgress} from "@mui/material";
import {useLogin} from "src/providers/LoginProvider";

const cookies = new Cookies();

type tokenResponseProps = Omit<TokenResponse, "error" | "error_description" | "error_uri">;

function LoginButton() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const open = Boolean(anchorEl);

    const {isLoggedIn, login, user} = useLogin();

    async function handleSuccess(tokenResponse: tokenResponseProps) {
        setIsLoading(true);

        await login(tokenResponse.access_token);

        setIsLoading(false);
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleError = () => {
        console.log("Login Failed");
    };

    const handleLogin = useGoogleLogin({
        onSuccess: (tokenResponse) => handleSuccess(tokenResponse),
        onError: () => handleError()
    });

    const handleLogout = () => {
        if (isLoggedIn) {
            cookies.remove("jwt");
            window.location.reload();
        }
    };

    return (
        <>
            {isLoggedIn ? (
                <>
                    <IconButton onClick={handleClick} aria-label="profile">
                        <AccountCircleIcon
                            fontSize="large"
                            style={{color: "#f9f9f9"}}
                            color="inherit"
                        />
                    </IconButton>
                    <Menu
                        id="login-positioned-menu"
                        aria-labelledby="login-positioned-button"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right"
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right"
                        }}
                    >
                        <MenuItem>
                            <Avatar sx={{width: 40, height: 40}} className="mr-2" />
                            <span>{user.email}</span>
                        </MenuItem>
                        <MenuItem onClick={() => handleLogout()}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </>
            ) : isLoading ? (
                <CircularProgress color="inherit" size={40} />
            ) : (
                <IconButton onClick={() => handleLogin()} aria-label="login">
                    <GoogleIcon style={{color: "#f9f9f9"}} color="inherit" />
                </IconButton>
            )}
        </>
    );
}

export default LoginButton;
