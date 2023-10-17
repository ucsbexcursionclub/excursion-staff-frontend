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
import {capitalizeFirstLetter} from "../utils/utils";
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

    //EDIT: only allow staff update if they are updating their own profile.
    const {retrieveStaffById, handleStaffUpdate} = useStaff();
    const {addNotification} = useSnackbar();

    const [staffDetails, setStaffDetails] = useState<StaffProps | null>();

    const handleClose = () => {
        onClose();
    };

    useEffect(() => {
        if (!loggedInMember?.staff_id) return;

        setName(loggedInMember.name);
        const retrievedStaff = retrieveStaffById(loggedInMember.staff_id);
        setStaffDetails(retrievedStaff);
    }, [loggedInMember, retrieveStaffById]);

    const [name, setName] = useState<string | undefined>(
        capitalizeFirstLetter(loggedInMember?.name ?? "")
    );
    const [bio, setBio] = useState<string | undefined>(staffDetails?.bio);
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(
        staffDetails?.profileImageUrl || null
    );
    const [deleteProfilePic, setDeleteProfilePic] = useState<boolean>(false);

    useEffect(() => {
        setBio(staffDetails?.bio);
        setProfileImageUrl(staffDetails?.profileImageUrl || null);
    }, [staffDetails]);

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleBioChange = (event: ChangeEvent<HTMLInputElement>) => {
        setBio(event.target.value);
    };

    const handleProfilePicChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            // Check for file size
            if (file.size > MAX_FILE_SIZE) {
                addNotification({
                    message: `Please upload an image smaller than ${MAX_FILE_SIZE_MB} MB.`,
                    type: "error"
                });
                return;
            }

            // Check for file type
            const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp"];
            if (!validImageTypes.includes(file.type)) {
                addNotification({
                    message: "Please upload a valid image type (JPEG, PNG, GIF, or BMP).",
                    type: "error"
                });
                return;
            }

            try {
                const resizedImageBlob = await readAndCompressImage(file, userConfig);
                setProfilePic(new File([resizedImageBlob], file.name, {type: file.type}));

                const reader = new FileReader();
                reader.onloadend = () => {
                    setProfileImageUrl(reader.result as string);
                };
                reader.readAsDataURL(resizedImageBlob);
            } catch (err) {
                addNotification({
                    message: "Error resizing the image. Please try again.",
                    type: "error"
                });
            }
        }
    };

    const handleSave = async () => {
        const memberUpdates: Partial<Omit<MemberProps, "_id">> = {};
        const staffUpdates: Partial<Omit<StaffProps, "_id">> = {};

        const newProfileImageUrl = profilePic
            ? await uploadFileToS3(profilePic)
            : deleteProfilePic
            ? null
            : staffDetails?.profileImageUrl;

        if (loggedInMember?.name && name !== loggedInMember.name) {
            memberUpdates.name = name;
        }

        if (staffDetails) {
            if (bio && bio !== staffDetails.bio) {
                staffUpdates.bio = bio;
            }

            // If profilePicPreview is empty, set profileImageUrl to null
            staffUpdates.profileImageUrl = newProfileImageUrl;
        }

        let updatedMember = true;
        let updatedStaff = true;

        updatedMember = Boolean(
            await handleMemberUpdate({...loggedInMember, ...memberUpdates} as MemberProps)
        );

        updatedStaff = Boolean(
            await handleStaffUpdate({...staffDetails, ...staffUpdates} as StaffProps)
        );

        if (updatedMember && updatedStaff) {
            addNotification({
                message: `Successfully updated profile!`,
                type: "success"
            });
            handleClose();
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
                                setDeleteProfilePic(true);
                                setProfilePic(null);
                                setProfileImageUrl("");
                            }}
                        >
                            <CloseIcon color="inherit" />
                        </IconButton>
                    )}
                    <Avatar
                        src={profileImageUrl || ""}
                        className="mb-4 mt-2 border-solid border-gray-400"
                        style={{width: 100, height: 100}}
                    ></Avatar>
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
                    onChange={handleProfilePicChange}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    className="border-2"
                    color="primary"
                >
                    Cancel
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileFormDialog;
