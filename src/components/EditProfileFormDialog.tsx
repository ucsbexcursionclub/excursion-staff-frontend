import React, {useState, ChangeEvent, useEffect} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {useStaff} from "../providers/StaffProvider";
import {MemberProps, StaffProps} from "../utils/types";
import {useMembers} from "../providers/MembersProvider";
import {BlurBackDrop} from "./HelperComponents";
import {uploadFileToS3} from "../utils/api";
import {MAX_FILE_SIZE, MAX_FILE_SIZE_MB} from "../utils/constants";
import {useSnackbar} from "../providers/SnackBarProvider";
import {capitalizeFirstLetter, generateResourceUrl} from "../utils/utils";
import {readAndCompressImage} from "browser-image-resizer";

const userConfig = {
    quality: 1,
    maxWidth: 500,
    autoRotate: true
};

interface EditProfileFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditProfileFormDialog: React.FC<EditProfileFormDialogProps> = ({isOpen, onClose}) => {
    const {handleMemberUpdate, loggedInMember} = useMembers();
    const {retrieveStaffById, handleStaffUpdate} = useStaff();
    const {addNotification} = useSnackbar();
    const [name, setName] = useState<string | undefined>("");
    const [bio, setBio] = useState<string | undefined>(""); 
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [profileBlobPath, setProfileBlobPath] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const staffId = loggedInMember?.staff_id;
        if (!staffId) return;

        setName(capitalizeFirstLetter(loggedInMember.name ?? ""));

        const fetchStaffDetails = async () => {
            const retrievedStaff = retrieveStaffById(staffId);
            setBio(retrievedStaff?.bio); // Set initial bio
            setProfileImageUrl(retrievedStaff?.profileImagePath || null);
        };

        fetchStaffDetails();
    }, [loggedInMember, retrieveStaffById]);

    const handleClose = () => {
        setProfileImage(null);
        setProfileImageUrl(null);
        onClose();
    };

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleBioChange = (event: ChangeEvent<HTMLInputElement>) => {
        setBio(event.target.value); 
    };

    const handleProfileImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check for file size
        if (file.size > MAX_FILE_SIZE) {
            addNotification({
                message: `Please upload an image smaller than ${MAX_FILE_SIZE_MB} MB.`,
                type: "error"
            });
            return;
        }

        // Check for file type
        const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp"];
        if (!validImageTypes.includes(file.type)) {
            addNotification({
                message: "Please upload a valid image type (JPEG, PNG, GIF, or BMP).",
                type: "error"
            });
            return;
        }

        try {
            const resizedImageBlob = await readAndCompressImage(file, userConfig);
            const resizedImageFile = new File([resizedImageBlob], file.name, {type: file.type});
            setProfileImage(resizedImageFile);

            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileBlobPath(reader.result as string);
            };
            reader.readAsDataURL(resizedImageBlob);
        } catch (err) {
            addNotification({
                message: "Error resizing the image. Please try again.",
                type: "error"
            });
        }
    };

    const handleSave = async (): Promise<void> => {
        setIsLoading(true);

        try {
            let newImageUrl = profileImageUrl;
            if (profileImage) {
                newImageUrl = await uploadFileToS3(profileImage);
            }

            // Update Member data if changed
            if (loggedInMember?.name !== name) {
                await handleMemberUpdate({...loggedInMember, name} as MemberProps);
            }

            // Update Staff data if changed
            if (loggedInMember?.staff_id) {
                const retrievedStaff = retrieveStaffById(loggedInMember.staff_id);
                const staffUpdates: Partial<Omit<StaffProps, "_id" | "member_id">> = {};

                // Only update if bio has been modified
                if (bio !== retrievedStaff?.bio) { 
                    staffUpdates.bio = bio;
                }

                if (newImageUrl !== retrievedStaff?.profileImagePath) {
                    staffUpdates.profileImagePath = newImageUrl;
                }

                if (Object.keys(staffUpdates).length > 0) {
                    await handleStaffUpdate({...retrievedStaff, ...staffUpdates} as StaffProps);
                }
            }

            addNotification({
                message: "Successfully updated profile!",
                type: "success"
            });
            handleClose();

        } catch (error: any) {
            addNotification({
                message: error.message,
                type: "error"
            });

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            fullWidth
            maxWidth={"sm"}
            open={isOpen}
            onClose={handleClose}
            slots={{backdrop: BlurBackDrop}}
            slotProps={{
                backdrop: {
                    open: isOpen,
                    onClose: handleClose
                }
            }}
        >
            <DialogTitle className="text-center">Edit Profile</DialogTitle>
            <DialogContent className="flex flex-col items-center">
                <div>
                    {profileImageUrl && (
                        <IconButton
                            className="absolute z-10 m-0 rounded-2xl text-white bg-black"
                            style={{padding: "2px"}}
                            onClick={() => {
                                setProfileImage(null);
                                setProfileImageUrl(null);
                            }}
                        >
                            <CloseIcon color="inherit" />
                        </IconButton>
                    )}
                    <Avatar
                        src={profileBlobPath || generateResourceUrl(profileImageUrl || "/resources/avatar.png")}
                        imgProps={{
                            onError: (e) => {
                                // Only fallback when not previewing a local blob
                                if (!profileBlobPath) {
                                    (e.target as HTMLImageElement).src = generateResourceUrl(
                                        "/resources/avatar.png"
                                    );
                                }
                            }
                        }}
                        className="mb-4 mt-2 border-solid border-gray-400"
                        style={{width: 100, height: 100}}
                    />
                </div>
                <label htmlFor="raised-button-file" className="mb-2">
                    <Button
                        variant="contained"
                        className="border-2 rounded-2xl font-bold"
                        component="span"
                    >
                        Upload Image
                    </Button>
                </label>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={handleNameChange}
                />
                <TextField
                    margin="dense"
                    id="bio"
                    label="Bio"
                    helperText="Enter your bio that is to be displayed on the staff page!"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    value={bio}
                    onChange={handleBioChange}
                />
                <input
                    accept="image/*"
                    style={{display: "none"}}
                    id="raised-button-file"
                    type="file"
                    onChange={handleProfileImageChange}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    className="border-2"
                    disabled={isLoading}
                    color="primary"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileFormDialog;
