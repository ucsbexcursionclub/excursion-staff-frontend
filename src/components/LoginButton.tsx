import React, {useEffect, useState} from "react";
import {useGoogleLogin, TokenResponse} from "@react-oauth/google";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import GoogleIcon from "@mui/icons-material/Google";
import Avatar from "@mui/material/Avatar";
import Logout from "@mui/icons-material/Logout";
import Cookies from "universal-cookie";
import {CircularProgress} from "@mui/material";
import {useLogin} from "../providers/LoginProvider";
import EditProfileFormDialog from "./EditProfileFormDialog"; // Import your EditProfileFormDialog component
import {Edit} from "@mui/icons-material";
import {useMembers} from "../providers/MembersProvider";
import {useStaff} from "../providers/StaffProvider";
import {generateResourceUrl} from "../utils/utils";

const cookies = new Cookies();

type tokenResponseProps = Omit<TokenResponse, "error" | "error_description" | "error_uri">;

function LoginButton() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false); // State for controlling the EditProfileFormDialog
    const [profileImagePath, setProfileImagePath] = useState<string | null>();
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const open = Boolean(anchorEl);

    const {isLoggedIn, login, isFetching} = useLogin();

    const {loggedInMember} = useMembers();
    const {retrieveStaffByMemberID} = useStaff();

    useEffect(() => {
        if (!loggedInMember) return;
        setProfileImagePath(retrieveStaffByMemberID(loggedInMember._id)?.profileImagePath || null);
        setIsLoaded(true);
    }, [loggedInMember, retrieveStaffByMemberID]);

    function handleSuccess(tokenResponse: tokenResponseProps) {
        login(tokenResponse.access_token);
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

    const handleEditProfileOpen = () => {
        setIsEditProfileOpen(true);
        setAnchorEl(null); // Close the menu when opening the Edit Profile dialog
    };

    const handleEditProfileClose = () => {
        setIsEditProfileOpen(false);
    };

    return (
        <>
            {isLoggedIn && isLoaded ? (
                <>
                    <IconButton onClick={handleClick} aria-label="profile">
                        <Avatar
                            sx={{width: 40, height: 40}}
                            src={generateResourceUrl(profileImagePath || "/resources/avatar.png")}
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
                            <Avatar
                                sx={{width: 40, height: 40}}
                                className="mr-2"
                                src={generateResourceUrl(
                                    profileImagePath || "/resources/avatar.png"
                                )}
                            />
                            <span>{loggedInMember?.email || ""}</span>
                        </MenuItem>
                        <MenuItem onClick={handleEditProfileOpen}>
                            <ListItemIcon>
                                <Edit fontSize="small" />
                            </ListItemIcon>
                            Edit Profile
                        </MenuItem>
                        <MenuItem onClick={() => handleLogout()}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                    <EditProfileFormDialog
                        isOpen={isEditProfileOpen}
                        onClose={handleEditProfileClose}
                    />
                </>
            ) : isFetching || (isLoggedIn && !isLoaded) ? (
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
