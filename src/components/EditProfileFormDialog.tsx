import React, {useState, ChangeEvent, useEffect} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import {useStaff} from "../providers/StaffProvider";
import {StaffProps} from "../utils/types";
import {useMembers} from "../providers/MembersProvider";
import {BlurBackDrop} from "./HelperComponents";

interface EditProfileFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditProfileFormDialog: React.FC<EditProfileFormDialogProps> = ({isOpen, onClose}) => {
    const {handleMemberUpdate, currentMemberData} = useMembers();

    //EDIT: only allow staff update if they are updating their own profile.
    const {retrieveStaffById, handleFileUpload, handleStaffUpdate} = useStaff();

    const [staffDetails, setStaffDetails] = useState<StaffProps>();

    const handleClose = () => {
        onClose();
    };

    useEffect(() => {
        if (!currentMemberData) return;

        setName(currentMemberData.name);
        const retrievedStaff = retrieveStaffById(currentMemberData.staff_id);

        setStaffDetails(retrievedStaff);
    }, [currentMemberData, retrieveStaffById]);

    const [name, setName] = useState<string>(currentMemberData?.name || "");
    const [bio, setBio] = useState<string>(staffDetails?.bio);
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [profilePicPreview, setProfilePicPreview] = useState<string>(
        staffDetails?.profileImageUrl || ""
    );

    useEffect(() => {
        setBio(staffDetails?.bio);
        setProfilePicPreview(staffDetails?.profileImageUrl);
    }, [staffDetails]);

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleBioChange = (event: ChangeEvent<HTMLInputElement>) => {
        setBio(event.target.value);
    };

    const handleProfilePicChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setProfilePic(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        const profileImageUrl = await handleFileUpload(profilePic);
        if (currentMemberData && name !== currentMemberData.name) {
            await handleMemberUpdate({...currentMemberData, name});
        }

        if (staffDetails && bio !== staffDetails?.bio) {
            await handleStaffUpdate({...staffDetails, bio, profileImageUrl});
        }

        handleClose();
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
                <Avatar
                    src={profilePicPreview}
                    className="mb-4 mt-2"
                    style={{width: 100, height: 100}}
                />
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
